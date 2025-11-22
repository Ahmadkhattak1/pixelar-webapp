'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Folder, Image as ImageIcon } from 'lucide-react';
import styles from './dashboard.module.css';

interface Project {
    id: string;
    title: string;
    type: 'scene' | 'sprite';
    date: string;
    preview: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';
type FilterOption = 'all' | 'scene' | 'sprite';

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([
        {
            id: '1',
            title: 'Forest Environment',
            type: 'scene',
            date: '2024-01-15',
            preview: '/placeholder-scene.png'
        },
        {
            id: '2',
            title: 'Character Idle',
            type: 'sprite',
            date: '2024-01-14',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '3',
            title: 'Dungeon Tileset',
            type: 'scene',
            date: '2024-01-12',
            preview: '/placeholder-scene.png'
        },
        {
            id: '4',
            title: 'Hero Sprite',
            type: 'sprite',
            date: '2024-01-10',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '5',
            title: 'Town Square',
            type: 'scene',
            date: '2024-01-08',
            preview: '/placeholder-scene.png'
        },
        {
            id: '6',
            title: 'Warrior Attack',
            type: 'sprite',
            date: '2024-01-07',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '7',
            title: 'Castle Interior',
            type: 'scene',
            date: '2024-01-06',
            preview: '/placeholder-scene.png'
        },
        {
            id: '8',
            title: 'Enemy Slime',
            type: 'sprite',
            date: '2024-01-05',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '9',
            title: 'Desert Background',
            type: 'scene',
            date: '2024-01-04',
            preview: '/placeholder-scene.png'
        },
        {
            id: '10',
            title: 'NPC Merchant',
            type: 'sprite',
            date: '2024-01-03',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '11',
            title: 'Cave System',
            type: 'scene',
            date: '2024-01-02',
            preview: '/placeholder-scene.png'
        },
        {
            id: '12',
            title: 'Collectible Coin',
            type: 'sprite',
            date: '2024-01-01',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '13',
            title: 'Boss Arena',
            type: 'scene',
            date: '2023-12-31',
            preview: '/placeholder-scene.png'
        },
        {
            id: '14',
            title: 'Dragon Boss',
            type: 'sprite',
            date: '2023-12-30',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '15',
            title: 'Village Market',
            type: 'scene',
            date: '2023-12-29',
            preview: '/placeholder-scene.png'
        },
        {
            id: '16',
            title: 'Mage Character',
            type: 'sprite',
            date: '2023-12-28',
            preview: '/placeholder-sprite.png'
        },
        {
            id: '17',
            title: 'Mountain Pass',
            type: 'scene',
            date: '2023-12-27',
            preview: '/placeholder-scene.png'
        },
        {
            id: '18',
            title: 'Chest Animation',
            type: 'sprite',
            date: '2023-12-26',
            preview: '/placeholder-sprite.png'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<FilterOption>('all');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const [imageError, setImageError] = useState<Record<string, boolean>>({});

    const handleImageError = (id: string) => {
        setImageError(prev => ({ ...prev, [id]: true }));
    };

    // Track scroll position
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter, search, and sort logic
    const filteredAndSortedProjects = useMemo(() => {
        let result = [...projects];

        // Search
        if (searchQuery) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by type
        if (filterType !== 'all') {
            result = result.filter(p => p.type === filterType);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'date-asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return result;
    }, [projects, searchQuery, filterType, sortBy]);

    const handleDelete = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
        setActiveMenuId(null);
    };

    const handleRename = (id: string, newTitle: string) => {
        setProjects(projects.map(p => p.id === id ? { ...p, title: newTitle } : p));
        setEditingId(null);
        setActiveMenuId(null);
    };

    const startRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditTitle(currentTitle);
        setActiveMenuId(null);
    };

    const toggleMenu = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (activeMenuId === id) {
            setActiveMenuId(null);
        } else {
            setActiveMenuId(id);
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleCreateScene = () => {
        console.log('Creating new scene...');
    };

    const handleCreateSprite = () => {
        console.log('Creating new sprite...');
    };

    const handleImportScene = () => {
        console.log('Importing scene...');
    };

    const handleImportSprite = () => {
        console.log('Importing sprite...');
    };

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <img src="/pixelar-logo.svg" alt="Pixelar" style={{ width: '32px', height: '32px' }} />
                    <div className={styles.headerDivider}></div>
                    <h1 className="text-h3 text-primary">Projects</h1>
                </div>

                <div className={styles.headerCenter}>
                    <button className="btn btn-primary" onClick={handleCreateScene}>
                        New Scene
                    </button>
                    <button className="btn btn-primary" onClick={handleCreateSprite}>
                        New Sprite
                    </button>
                    <button className="btn btn-secondary" onClick={handleImportScene}>
                        Import
                    </button>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.statusBar}>
                        <div className={styles.statusItem}>
                            <span className="text-mono">CREDITS</span>
                            <span className="text-accent" style={{ fontSize: '18px', fontWeight: 'var(--font-weight-bold)' }}>1,250</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.statusItem}>
                            <span className="text-mono">PRO</span>
                            <button className={styles.upgradeBtn}>
                                <span className="text-mono" style={{ fontSize: '11px' }}>UPGRADE</span>
                            </button>
                        </div>
                    </div>

                    <button className={styles.profileBtn}>
                        <div className={styles.avatar}>JD</div>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Projects Section */}
                <section className={styles.projectsSection}>
                    {/* Sticky Pill - Shows on scroll */}
                    {isScrolled && (
                        <div className={styles.stickyPill}>
                            <div className={styles.pillContent}>
                                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                    PROJECTS
                                </span>
                                <div className={styles.pillActions}>
                                    <button className="btn btn-primary" onClick={handleCreateScene} style={{ padding: '8px 16px', fontSize: '12px' }}>
                                        New Scene
                                    </button>
                                    <button className="btn btn-primary" onClick={handleCreateSprite} style={{ padding: '8px 16px', fontSize: '12px' }}>
                                        New Sprite
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleImportScene} style={{ padding: '8px 16px', fontSize: '12px' }}>
                                        Import
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.searchBox}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <button
                                className={`${styles.filterBtn} ${filterType === 'all' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilterType('all')}
                            >
                                <span className="text-mono" style={{ fontSize: '11px' }}>ALL</span>
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filterType === 'scene' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilterType('scene')}
                            >
                                <span className="text-mono" style={{ fontSize: '11px' }}>SCENES</span>
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filterType === 'sprite' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilterType('sprite')}
                            >
                                <span className="text-mono" style={{ fontSize: '11px' }}>SPRITES</span>
                            </button>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className={styles.sortSelect}
                        >
                            <option value="date-desc">Recent</option>
                            <option value="date-asc">Oldest</option>
                            <option value="name-asc">A-Z</option>
                            <option value="name-desc">Z-A</option>
                        </select>

                        <span className="text-mono" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                            {filteredAndSortedProjects.length} OF {projects.length}
                        </span>
                    </div>

                    <div className={styles.projectsGrid}>
                        {filteredAndSortedProjects.map((project) => (
                            <div key={project.id} className={styles.projectCard}>
                                {/* Preview */}
                                <div className={styles.cardPreview}>
                                    {!imageError[project.id] ? (
                                        <img
                                            src={project.preview}
                                            alt={project.title}
                                            onError={() => handleImageError(project.id)}
                                        />
                                    ) : (
                                        <div className={styles.placeholderPreview}>
                                            {project.type === 'scene' ? <ImageIcon size={48} strokeWidth={1} /> : <Folder size={48} strokeWidth={1} />}
                                        </div>
                                    )}
                                    <div className={styles.cardOverlay}>
                                        <button className="btn btn-primary" style={{ padding: '8px 16px' }}>
                                            Open
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className={styles.cardInfo}>
                                    <div className={styles.cardHeader}>
                                        {editingId === project.id ? (
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onBlur={() => handleRename(project.id, editTitle)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRename(project.id, editTitle);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className={styles.editInput}
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <h3 className={styles.cardTitle} title={project.title}>
                                                {project.title}
                                            </h3>
                                        )}
                                        <button
                                            className={styles.cardMenuBtn}
                                            onClick={(e) => toggleMenu(project.id, e)}
                                            aria-expanded={activeMenuId === project.id}
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.cardMeta}>
                                        <span className={styles.cardType}>
                                            {project.type}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(project.date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Menu Dropdown */}
                                {activeMenuId === project.id && (
                                    <div className={styles.menuDropdown} onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className={styles.menuItem}
                                            onClick={() => startRename(project.id, project.title)}
                                        >
                                            <Edit2 size={14} />
                                            Rename
                                        </button>
                                        <button
                                            className={`${styles.menuItem} ${styles.menuItemDelete}`}
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
