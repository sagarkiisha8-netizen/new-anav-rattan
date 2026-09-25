import { SiteContent } from "./types";

export interface ImageUsageLocation {
  page: string;
  section: string;
  field: string;
  label: string;
  controllerLink: string;
}

export const PROTECTED_DEFAULT_ASSETS = [
  "/images/dr-rattan-and-dr-anav-rattan-hero2.png",
  "/images/dr-ganesh-dutt-rattan-0.jpeg",
  "/images/dr-anav-rattan-1.jpeg",
  "/favicon.ico",
  "dr-rattan-and-dr-anav-rattan-hero2.png",
  "dr-ganesh-dutt-rattan-0.jpeg",
  "dr-anav-rattan-1.jpeg",
  "favicon.ico",
];

export function isProtectedDefaultAsset(urlOrFilename: string): boolean {
  if (!urlOrFilename) return false;
  const clean = urlOrFilename.trim().toLowerCase();
  const filename = clean.split("/").pop() || clean;
  return PROTECTED_DEFAULT_ASSETS.some(
    (p) => p.toLowerCase() === clean || p.toLowerCase() === filename
  );
}

function matchesUrlOrFilename(target: string | undefined | null, query: string): boolean {
  if (!target || !query) return false;
  const tNorm = target.trim().toLowerCase();
  const qNorm = query.trim().toLowerCase();
  if (tNorm === qNorm) return true;
  const tBase = tNorm.split("/").pop();
  const qBase = qNorm.split("/").pop();
  return Boolean(tBase && qBase && tBase === qBase);
}

export function scanAllImageUsages(content: SiteContent): Record<string, ImageUsageLocation[]> {
  const map: Record<string, ImageUsageLocation[]> = {};

  const recordUsage = (url: string | undefined | null, loc: ImageUsageLocation) => {
    if (!url || typeof url !== "string" || !url.trim()) return;
    const cleanUrl = url.trim();
    if (!map[cleanUrl]) {
      map[cleanUrl] = [];
    }
    // Avoid duplicate entries
    const exists = map[cleanUrl].some(
      (existing) => existing.page === loc.page && existing.section === loc.section && existing.field === loc.field
    );
    if (!exists) {
      map[cleanUrl].push(loc);
    }
  };

  // 1. Home Page Hero
  if (content.home?.hero?.image) {
    recordUsage(content.home.hero.image, {
      page: "Home",
      section: "Hero Banner Section",
      field: "home.hero.image",
      label: "Main Hero Doctors Portrait",
      controllerLink: "/admin/pages",
    });
  }

  // 2. About Page Legacy
  if (content.about?.legacyImage) {
    recordUsage(content.about.legacyImage, {
      page: "About",
      section: "Heritage Legacy Section",
      field: "about.legacyImage",
      label: "Legacy Institution Featured Image",
      controllerLink: "/admin/pages",
    });
  }

  // 3. Doctors Profiles
  if (Array.isArray(content.doctors)) {
    content.doctors.forEach((doc) => {
      if (doc.image) {
        recordUsage(doc.image, {
          page: "Doctors",
          section: `Dr. ${doc.name} Profile`,
          field: `doctors.${doc.id}.image`,
          label: `${doc.name} Official Portrait`,
          controllerLink: "/admin/doctors",
        });
        // Also used in Home page preview
        recordUsage(doc.image, {
          page: "Home",
          section: "Meet The Doctors Preview Section",
          field: `doctors.${doc.id}.image`,
          label: `${doc.name} Home Card Photo`,
          controllerLink: "/admin/pages",
        });
      }
    });
  }

  // 4. Services
  if (Array.isArray(content.services)) {
    content.services.forEach((srv) => {
      const srvImg = (srv as unknown as { image?: string }).image;
      if (srvImg) {
        recordUsage(srvImg, {
          page: "Services",
          section: `Service: ${srv.name}`,
          field: `services.${srv.id}.image`,
          label: `${srv.name} Featured Image`,
          controllerLink: "/admin/services",
        });
      }
    });
  }

  // 5. Research Milestones
  if (content.research?.milestones && Array.isArray(content.research.milestones)) {
    content.research.milestones.forEach((m) => {
      if (m.image) {
        recordUsage(m.image, {
          page: "Research",
          section: `Milestone: ${m.title}`,
          field: `research.milestones.${m.id}.image`,
          label: `${m.title} Image`,
          controllerLink: "/admin/pages",
        });
      }
    });
  }

  // 6. Gallery
  if (Array.isArray(content.gallery)) {
    content.gallery.forEach((g) => {
      if (g.src) {
        recordUsage(g.src, {
          page: "Gallery",
          section: `Gallery Photo: ${g.title || g.id}`,
          field: `gallery.${g.id}.src`,
          label: g.title || "Gallery Photo",
          controllerLink: "/admin/pages",
        });
      }
    });
  }

  return map;
}

export function getImageUsages(urlOrFilename: string, content: SiteContent): ImageUsageLocation[] {
  if (!urlOrFilename) return [];
  const allUsages = scanAllImageUsages(content);

  const matched: ImageUsageLocation[] = [];
  for (const [keyUrl, locs] of Object.entries(allUsages)) {
    if (matchesUrlOrFilename(keyUrl, urlOrFilename)) {
      matched.push(...locs);
    }
  }

  // Remove duplicates based on unique page+section
  const unique: ImageUsageLocation[] = [];
  matched.forEach((m) => {
    if (!unique.some((u) => u.page === m.page && u.section === m.section && u.field === m.field)) {
      unique.push(m);
    }
  });

  return unique;
}

export function unlinkImageFromContent(urlOrFilename: string, content: SiteContent): SiteContent {
  const updated: SiteContent = JSON.parse(JSON.stringify(content));

  // Home Hero
  if (matchesUrlOrFilename(updated.home?.hero?.image, urlOrFilename)) {
    updated.home.hero.image = "";
  }

  // About Legacy
  if (matchesUrlOrFilename(updated.about?.legacyImage, urlOrFilename)) {
    updated.about.legacyImage = "";
  }

  // Doctors
  if (Array.isArray(updated.doctors)) {
    updated.doctors = updated.doctors.map((doc) => {
      if (matchesUrlOrFilename(doc.image, urlOrFilename)) {
        return { ...doc, image: "" };
      }
      return doc;
    });
  }

  // Services
  if (Array.isArray(updated.services)) {
    updated.services = updated.services.map((srv) => {
      const srvObj = srv as unknown as { image?: string };
      if (matchesUrlOrFilename(srvObj.image, urlOrFilename)) {
        return { ...srv, image: "" };
      }
      return srv;
    });
  }

  // Research
  if (Array.isArray(updated.research?.milestones)) {
    updated.research.milestones = updated.research.milestones.map((m) => {
      if (matchesUrlOrFilename(m.image, urlOrFilename)) {
        return { ...m, image: "" };
      }
      return m;
    });
  }

  // Gallery
  if (Array.isArray(updated.gallery)) {
    updated.gallery = updated.gallery.filter((g) => !matchesUrlOrFilename(g.src, urlOrFilename));
  }

  return updated;
}
