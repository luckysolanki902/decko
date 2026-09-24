import type { MetadataRoute } from 'next';

import { COURSE_IDS, COURSE_SEO, getAllPhaseParams, getLectures } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    entry('/', 'weekly', 1),
    entry('/requests', 'weekly', 0.5),
  ];

  for (const courseId of COURSE_IDS) {
    const course = COURSE_SEO[courseId];
    routes.push(
      entry(course.route, 'weekly', 0.9, [`${SITE_URL}/og/${courseId}/course/overview`]),
      entry(`${course.route}/notes`, 'weekly', 0.8),
      entry(`${course.route}/projects`, 'monthly', 0.7),
    );

    for (const { phaseId } of getAllPhaseParams(courseId)) {
      routes.push(entry(`${course.route}/${phaseId}`, 'monthly', 0.7, [`${SITE_URL}/og/${courseId}/phase/${phaseId}`]));
    }

    for (const lecture of getLectures(courseId)) {
      routes.push({
        ...entry(
          `${course.route}/notes/${lecture.slug}`,
          'monthly',
          0.8,
          [`${SITE_URL}/og/${courseId}/lecture/${encodeURIComponent(lecture.slug)}`],
        ),
        lastModified: lecture.lastModified,
      });
    }
  }

  return routes;
}

function entry(
  pathname: string,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>,
  priority: number,
  images?: string[],
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${pathname}`,
    changeFrequency,
    priority,
    ...(images ? { images } : {}),
  };
}
