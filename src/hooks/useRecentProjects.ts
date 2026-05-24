import React from 'react';
import { RECENT_PROJECTS_LIMIT } from '../services/constants';
import type { RecentProject } from '../types';
import { usePersistentState } from './usePersistentState';

export function useRecentProjects() {
  const [recentProjects, setRecentProjects] = usePersistentState<RecentProject[]>('recentProjects', []);

  const rememberRecentProject = React.useCallback(
    (project: RecentProject) => {
      let evictedProjectIds: string[] = [];
      setRecentProjects((prev) => {
        const filtered = prev.filter((item) => item.id !== project.id);
        const next = [{ ...project }, ...filtered];
        evictedProjectIds = next.slice(RECENT_PROJECTS_LIMIT).map((item) => item.id);
        return next.slice(0, RECENT_PROJECTS_LIMIT);
      });
      return evictedProjectIds;
    },
    [setRecentProjects]
  );

  const forgetRecentProject = React.useCallback(
    (projectId: string) => {
      setRecentProjects((prev) => prev.filter((project) => project.id !== projectId));
    },
    [setRecentProjects]
  );

  return {
    recentProjects,
    rememberRecentProject,
    forgetRecentProject,
  };
}
