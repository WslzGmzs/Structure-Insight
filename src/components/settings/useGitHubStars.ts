import React from 'react';
import { APP_GITHUB_API_URL } from '../../services/appMetadata';
import type { SettingsSectionId } from './types';

export function useGitHubStars(isOpen: boolean, activeSection: SettingsSectionId) {
    const [stars, setStars] = React.useState<number | null>(null);
    const [starsLoading, setStarsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        setStars(null);
        setStarsLoading(false);
    }, [isOpen]);

    React.useEffect(() => {
        if (!isOpen || activeSection !== 'about') {
            return;
        }

        let cancelled = false;
        setStarsLoading(true);

        fetch(APP_GITHUB_API_URL)
            .then(res => res.json())
            .then(data => {
                if (cancelled) {
                    return;
                }
                setStars(typeof data?.stargazers_count === 'number' ? data.stargazers_count : null);
            })
            .catch(() => {
                if (!cancelled) {
                    setStars(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setStarsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, activeSection]);

    return { stars, starsLoading };
}

