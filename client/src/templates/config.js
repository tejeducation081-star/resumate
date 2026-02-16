import { fontOptions } from '../data/fonts';
export { fontOptions };
export const fonts = fontOptions; // Alias for backward compatibility

const archetypes = [
    // 1. EXECUTIVE: Conservative, text-heavy, serif/classic fonts
    {
        name: 'Executive',
        baseLayouts: ['classic', 'minimal'],
        baseHeaders: ['center', 'left'],
        fonts: ['Classic', 'Elegant'],
        accents: ['#1e293b', '#334155', '#111827'], // Dark Slates/Navys
        sectionStyles: ['underline', 'caps-minimal'],
        decor: ['none', 'line']
    },
    // 2. MODERN: Clean, sans-serif, standard structures
    {
        name: 'Modern',
        baseLayouts: ['modern', 'classic'],
        baseHeaders: ['left', 'banner'],
        fonts: ['Modern', 'Clean'],
        accents: ['#2563EB', '#0284c7', '#0891b2'], // Blues/Cyans
        sectionStyles: ['box', 'line-beside'],
        decor: ['none', 'circle-accents']
    },
    // 3. CREATIVE: Sidebars, colors, playful layouts
    {
        name: 'Creative',
        baseLayouts: ['sidebar', 'grid'],
        baseHeaders: ['left', 'split'],
        fonts: ['Clean', 'Modern'],
        accents: ['#7C3AED', '#DB2777', '#EA580C'], // Purple, Pink, Orange
        sectionStyles: ['bracket', 'box'],
        decor: ['blob', 'dots']
    },
    // 4. MINIMALIST: White space, small type, very clean
    {
        name: 'Minimalist',
        baseLayouts: ['minimal'],
        baseHeaders: ['left'],
        fonts: ['Modern', 'Technical'],
        accents: ['#374151', '#000000'], // Mono
        sectionStyles: ['caps-minimal'],
        decor: ['none']
    },
    // 5. BOLD: Heavy headers, contrast
    {
        name: 'Bold',
        baseLayouts: ['modern', 'sidebar'],
        baseHeaders: ['banner', 'split'],
        fonts: ['Bold', 'Modern'],
        accents: ['#111827', '#b91c1c'], // Black, Red
        sectionStyles: ['box', 'underline'],
        decor: ['diagonal', 'solid-block']
    },
    // 6. ELEGANT: Centered, lighter touches, serif
    {
        name: 'Elegant',
        baseLayouts: ['classic', 'modern'],
        baseHeaders: ['center'],
        fonts: ['Elegant'],
        accents: ['#be123c', '#047857', '#a16207'], // Rose, Emerald, Gold
        sectionStyles: ['line-beside', 'underline'],
        decor: ['border-frame']
    },
    // 7. TECH: Grid based, mono fonts
    {
        name: 'Tech',
        baseLayouts: ['grid', 'sidebar'],
        baseHeaders: ['left', 'minimal'],
        fonts: ['Technical', 'Modern'],
        accents: ['#10B981', '#6366f1'], // Green, Indigo
        sectionStyles: ['bracket', 'line-beside'],
        decor: ['grid-pattern']
    }
];

// REPLICA TEMPLATES: Specific matches for user uploaded images - ALL 23 TEMPLATES
const replicaTemplates = [
    // Template 1: Pink Elegant Modern - ENHANCED
    {
        id: 'elegant-pink-modern',
        name: 'Modern Silk',
        category: 'Professional',
        styles: {
            layout: 'modern-silk',
            headerStyle: 'left',
            fontFamily: "'Outfit', sans-serif",
            accent: '#db2777',
            sidebarBg: '#fce7f3',
            sectionStyles: 'bracket',
            decor: 'blob',
            backgroundColor: '#fff5fb'
        }
    },
    // Template 2: Jennifer Watson - Clean Classic - ENHANCED
    {
        id: 'clean-watson-classic',
        name: 'Zenith Minimal',
        category: 'Minimal',
        styles: {
            layout: 'zenith-minimal',
            headerStyle: 'zenith',
            fontFamily: "'Crimson Pro', serif",
            accent: '#1e40af',
            sectionStyles: 'zenith',
            decor: 'zenith-border',
            backgroundColor: 'white'
        }
    },
    // Template 3: Laura Anderson - Minimalist Gray - ENHANCED
    {
        id: 'minimalist-laura',
        name: 'Apex Plain',
        category: 'Minimal',
        styles: {
            layout: 'apex-plain',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#059669',
            sectionStyles: 'circle-title',
            decor: 'dots',
            backgroundColor: '#ffffff'
        }
    },
    // Template 5: Mathew Smith - Yellow Sidebar - ENHANCED
    {
        id: 'sidebar-yellow-mathew',
        name: 'Horizon Sidebar',
        category: 'Professional',
        styles: {
            layout: 'horizon-sidebar',
            headerStyle: 'left',
            fontFamily: "'Oswald', sans-serif",
            accent: '#ff6b35',
            sidebarBg: '#fbbf24',
            sectionStyles: 'bracket',
            decor: 'solid-block'
        }
    },
    // Template 6: Emma Anderson - Classic Layout - ENHANCED
    {
        id: 'classic-emma',
        name: 'Heritage Classic',
        category: 'Classic',
        styles: {
            layout: 'classic',
            headerStyle: 'split',
            fontFamily: "'Crimson Pro', serif",
            accent: '#7c3aed',
            sectionStyles: 'line-beside',
            decor: 'border-frame'
        }
    },
    // Template 9: Teal Split Header (Torent) - ENHANCED
    {
        id: 'split-teal-torent',
        name: 'Venture Split',
        category: 'Modern',
        styles: {
            layout: 'sidebar',
            headerStyle: 'split',
            fontFamily: "'Inter', sans-serif",
            accent: '#06b6d4',
            sidebarBg: '#0d7377',
            sectionStyles: 'box',
            decor: 'circle-accents'
        }
    },
    // Template 10: James Smith - Professional Nursing - ENHANCED
    {
        id: 'professional-james-nursing',
        name: 'Clinical Pro',
        category: 'Professional',
        styles: {
            layout: 'sidebar',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#0891b2',
            sidebarBg: '#006b6b',
            sectionStyles: 'bracket',
            decor: 'accent-strip'
        }
    },
    // Template 11: Marian Keyes - Dark Modern - ENHANCED
    {
        id: 'dark-modern-marian',
        name: 'Orbit Modern',
        category: 'Modern',
        styles: {
            layout: 'sidebar',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#3b82f6',
            sidebarBg: '#1e293b',
            sectionStyles: 'bracket',
            decor: 'circle-accents'
        }
    },
    // Template 29: Thomas Smith - Blue Sidebar Detail - ENHANCED
    {
        id: 'replica-29',
        name: 'Edge Detailed',
        category: 'Professional',
        styles: {
            layout: 'sidebar',
            headerStyle: 'split',
            fontFamily: "'Inter', sans-serif",
            accent: '#06b6d4',
            sidebarBg: '#0f766e',
            sectionStyles: 'bracket',
            decor: 'accent-strip',
            roundedContent: true
        }
    },
    // Template 30: Anne Robertson - Yellow Diagonal - ENHANCED
    {
        id: 'replica-30',
        name: 'Skew Dynamic',
        category: 'Professional',
        styles: {
            layout: 'sidebar',
            headerStyle: 'diagonal-banner',
            fontFamily: "'Inter', sans-serif",
            accent: '#fbbf24',
            sidebarBg: '#f59e0b',
            sectionStyles: 'bracket',
            decor: 'solid-block'
        }
    },
    // Template 31: David Anderson - Yellow Circle UI - ENHANCED
    {
        id: 'replica-31',
        name: 'Circle Minimal',
        category: 'Minimal',
        styles: {
            layout: 'minimal',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#f59e0b',
            sectionStyles: 'circle-title',
            decor: 'dots'
        }
    },
    // Template 32: Malkin Anderson - Pink Soft Blocks - ENHANCED
    {
        id: 'replica-32',
        name: 'Block Pastel',
        category: 'Creative',
        styles: {
            layout: 'sidebar',
            headerStyle: 'split',
            fontFamily: "'Inter', sans-serif",
            accent: '#ec4899',
            sidebarBg: '#fbcfe8',
            sectionStyles: 'bracket',
            decor: 'blob'
        }
    },
    // Template 33: Mathew Smith - Navy Gold Executive - ENHANCED
    {
        id: 'replica-33',
        name: 'Royal Executive',
        category: 'Professional',
        styles: {
            layout: 'sidebar',
            headerStyle: 'left',
            fontFamily: "'Oswald', sans-serif",
            accent: '#fbbf24',
            sidebarBg: '#1e3a8a',
            sectionStyles: 'bracket',
            decor: 'gold-line'
        }
    },
    // Template 34: Cyber-Terminal - ENHANCED
    {
        id: 'replica-34',
        name: 'System Root',
        category: 'Tech',
        styles: {
            layout: 'cyber',
            headerStyle: 'left',
            fontFamily: "'JetBrains Mono', monospace",
            accent: '#22c55e',
            sidebarBg: '#0a0a0a',
            sectionStyles: 'bracket',
            decor: 'grid-pattern'
        }
    },
    // Template 35: Magazine Asymmetric - ENHANCED
    {
        id: 'replica-35',
        name: 'Editorial Luxe',
        category: 'Creative',
        styles: {
            layout: 'magazine',
            headerStyle: 'asymmetric',
            fontFamily: "'Playfair Display', serif",
            accent: '#dc2626',
            backgroundColor: '#f5f5f5',
            sectionStyles: 'underline',
            decor: 'border-frame'
        }
    },
    // Template 36: Timeline Visual - ENHANCED
    {
        id: 'replica-36',
        name: 'Chrono Map',
        category: 'Modern',
        styles: {
            layout: 'timeline',
            headerStyle: 'center',
            fontFamily: "'Inter', sans-serif",
            accent: '#6366f1',
            sectionStyles: 'underline',
            decor: 'dots'
        }
    },
    // Template 37: Floating Cards - ENHANCED
    {
        id: 'replica-37',
        name: 'Deck UI',
        category: 'Minimal',
        styles: {
            layout: 'cards',
            headerStyle: 'banner',
            fontFamily: "'Outfit', sans-serif",
            accent: '#3b82f6',
            backgroundColor: '#eff6ff',
            sidebarBg: '#1e40af',
            sectionStyles: 'box',
            decor: 'blob'
        }
    },
    // Template 38: Neon Glow - ENHANCED
    {
        id: 'replica-38',
        name: 'Neon Night',
        category: 'Creative',
        styles: {
            layout: 'sidebar',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#ec4899',
            sidebarBg: '#0f0f0f',
            sectionStyles: 'bracket',
            decor: 'diagonal'
        }
    },
    // Template 39: Brutalist Raw - ENHANCED
    {
        id: 'replica-39',
        name: 'RAW Impact',
        category: 'Creative',
        styles: {
            layout: 'brutalist',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#000000',
            sidebarBg: '#fbbf24',
            sectionStyles: 'bracket',
            decor: 'solid-block'
        }
    },
    // Template 40: Split Vertical - ENHANCED
    {
        id: 'replica-40',
        name: 'Dual Pane',
        category: 'Modern',
        styles: {
            layout: 'split-vertical',
            headerStyle: 'split',
            fontFamily: "'Outfit', sans-serif",
            accent: '#6366f1',
            sidebarBg: '#1e293b',
            sectionStyles: 'bracket',
            decor: 'circle-accents'
        }
    },
    // Template 41: Sidebar Focus - ENHANCED
    {
        id: 'replica-41',
        name: 'Focus Sidebar',
        category: 'Professional',
        styles: {
            layout: 'sidebar',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#059669',
            sidebarBg: '#dcfce7',
            sectionStyles: 'bracket',
            decor: 'circle-accents'
        }
    },
    // Template 42: The Gazette - ENHANCED
    {
        id: 'replica-42',
        name: 'The Gazette',
        category: 'Classic',
        styles: {
            layout: 'classic',
            headerStyle: 'center',
            fontFamily: "'Crimson Pro', serif",
            accent: '#1f2937',
            sectionStyles: 'underline',
            decor: 'border-frame'
        }
    },
    // Template 43: Bauhaus - ENHANCED
    {
        id: 'replica-43',
        name: 'Bauhaus',
        category: 'Creative',
        styles: {
            layout: 'sidebar',
            headerStyle: 'banner',
            fontFamily: "'Inter', sans-serif",
            accent: '#dc2626',
            sidebarBg: '#1f2937',
            sectionStyles: 'box',
            decor: 'solid-block'
        }
    },
    // Template 44: Retro Console - ENHANCED
    {
        id: 'replica-44',
        name: 'Retro Console',
        category: 'Modern',
        styles: {
            layout: 'cyber',
            headerStyle: 'banner',
            fontFamily: "'JetBrains Mono', monospace",
            accent: '#84cc16',
            sidebarBg: '#1f1f1f',
            sectionStyles: 'bracket',
            decor: 'grid-pattern'
        }
    },
    // Template 45: Swiss Grid - ENHANCED
    {
        id: 'replica-45',
        name: 'Swiss Grid',
        category: 'Minimal',
        styles: {
            layout: 'grid',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#1f2937',
            sectionStyles: 'underline',
            decor: 'grid-pattern'
        }
    },
    // Template 46: Industrial Iron - ENHANCED
    {
        id: 'replica-46',
        name: 'Industrial Iron',
        category: 'Professional',
        styles: {
            layout: 'modern',
            headerStyle: 'left',
            fontFamily: "'Oswald', sans-serif",
            accent: '#64748b',
            sidebarBg: '#1e293b',
            sectionStyles: 'bracket',
            decor: 'solid-block'
        }
    },
    // Template 47: The Manifesto - ENHANCED
    {
        id: 'replica-47',
        name: 'The Manifesto',
        category: 'Creative',
        styles: {
            layout: 'magazine',
            headerStyle: 'asymmetric',
            fontFamily: "'Inter', sans-serif",
            accent: '#000000',
            backgroundColor: '#f5f5f5',
            sectionStyles: 'underline',
            decor: 'border-frame'
        }
    },
    // Template 48: Organic Flow - ENHANCED
    {
        id: 'replica-48',
        name: 'Organic Flow',
        category: 'Creative',
        styles: {
            layout: 'sidebar',
            headerStyle: 'banner',
            fontFamily: "'Outfit', sans-serif",
            accent: '#059669',
            sidebarBg: '#d1fae5',
            sectionStyles: 'bracket',
            decor: 'blob'
        }
    },
    // Template 49: Nordic Flow (Hybrid Zenith)
    {
        id: 'hybrid-nordic',
        name: 'Nordic Flow',
        category: 'Minimal',
        styles: {
            layout: 'zenith-minimal',
            headerStyle: 'left',
            fontFamily: "'Outfit', sans-serif",
            accent: '#0f766e', // Teal
            sectionStyles: 'zenith',
            decor: 'dots'
        }
    },
    // Template 50: Glitch Tech (Hybrid Cyber)
    {
        id: 'hybrid-glitch',
        name: 'Glitch Tech',
        category: 'Tech',
        styles: {
            layout: 'cyber',
            headerStyle: 'right',
            fontFamily: "'Courier Prime', monospace",
            accent: '#f43f5e', // Pink Neon
            sidebarBg: '#1f1f1f',
            sectionStyles: 'box',
            decor: 'glitch'
        }
    },
    // Template 51: Paper Sheet (Hybrid Modern Silk)
    {
        id: 'hybrid-paper',
        name: 'Paper Sheet',
        category: 'Classic',
        styles: {
            layout: 'modern-silk',
            headerStyle: 'center',
            fontFamily: "'Crimson Pro', serif",
            accent: '#78350f', // Brown
            sidebarBg: '#fef3c7', // Paper yellow
            backgroundColor: '#fef3c7',
            sectionStyles: 'underline',
            decor: 'none'
        }
    },
    // Template 52: Highrise (Hybrid Split Vertical)
    {
        id: 'hybrid-highrise',
        name: 'Highrise',
        category: 'Modern',
        styles: {
            layout: 'split-vertical',
            headerStyle: 'split',
            fontFamily: "'Inter', sans-serif",
            accent: '#0ea5e9', // Sky Blue
            sidebarBg: '#0f172a', // Dark Slate
            sectionStyles: 'caps-minimal',
            decor: 'line'
        }
    },
    // Template 53: Compact Card (Hybrid Cards)
    {
        id: 'hybrid-card',
        name: 'Compact Card',
        category: 'Minimal',
        styles: {
            layout: 'cards',
            headerStyle: 'left',
            fontFamily: "'Outfit', sans-serif",
            accent: '#8b5cf6', // Violet
            backgroundColor: '#f3f4f6',
            sectionStyles: 'box',
            decor: 'none'
        }
    },
    // Template 54: Architect (Hybrid Grid)
    {
        id: 'hybrid-architect',
        name: 'The Architect',
        category: 'Professional',
        styles: {
            layout: 'grid',
            headerStyle: 'left',
            fontFamily: "'Oswald', sans-serif",
            accent: '#262626', // Neutral Black
            sectionStyles: 'line-beside',
            decor: 'grid-pattern'
        }
    },
    // Template 55: Corporate Blue (Hybrid Horizon)
    {
        id: 'hybrid-corp-blue',
        name: 'Corporate Blue',
        category: 'Professional',
        styles: {
            layout: 'horizon-sidebar',
            headerStyle: 'left',
            fontFamily: "'Inter', sans-serif",
            accent: '#1e3a8a', // Dark Blue
            sidebarBg: '#e2e8f0', // Light Grey Sidebar
            sectionStyles: 'bracket',
            decor: 'solid-block'
        }
    },
    // Template 56: Soft Splash (Hybrid Modern Silk)
    {
        id: 'hybrid-splash',
        name: 'Soft Splash',
        category: 'Creative',
        styles: {
            layout: 'modern-silk',
            headerStyle: 'center',
            fontFamily: "'Outfit', sans-serif",
            accent: '#8b5cf6', // Purple
            sidebarBg: '#f3e8ff', // Soft Purple
            backgroundColor: '#f3e8ff',
            sectionStyles: 'blob',
            decor: 'blob'
        }
    },
    // Template 57: Newspaper (Hybrid Magazine)
    {
        id: 'hybrid-newspaper',
        name: 'Daily Press',
        category: 'Classic',
        styles: {
            layout: 'magazine',
            headerStyle: 'center',
            fontFamily: "'Playfair Display', serif",
            accent: '#111827',
            backgroundColor: '#fffdf5', // Newsprint
            sectionStyles: 'line-beside',
            decor: 'line'
        }
    },
    // Template 58: Code Block (Hybrid Cyber)
    {
        id: 'hybrid-code',
        name: 'Code Block',
        category: 'Tech',
        styles: {
            layout: 'cyber',
            headerStyle: 'left',
            fontFamily: "'JetBrains Mono', monospace",
            accent: '#059669', // Matrix Green
            sidebarBg: '#ffffff', // Light Theme
            sectionStyles: 'bracket',
            decor: 'grid-pattern'
        }
    },
    // Template 59: Minty Fresh (Hybrid Sidebar)
    {
        id: 'hybrid-mint',
        name: 'Minty Fresh',
        category: 'Modern',
        styles: {
            layout: 'sidebar',
            headerStyle: 'banner',
            fontFamily: "'Inter', sans-serif",
            accent: '#10b981',
            sidebarBg: '#d1fae5',
            sectionStyles: 'none',
            decor: 'circle-accents'
        }
    },
    // Template 60: Crimson Edge (Hybrid Classic)
    {
        id: 'hybrid-crimson',
        name: 'Crimson Edge',
        category: 'Classic',
        styles: {
            layout: 'classic',
            headerStyle: 'left',
            fontFamily: "'Crimson Pro', serif",
            accent: '#ea580c', // Crimson/Orange
            sectionStyles: 'line-beside',
            decor: 'border-frame'
        }
    },
    // Template 61: Gold Standard (Hybrid Horizon)
    {
        id: 'hybrid-gold',
        name: 'Gold Standard',
        category: 'Professional',
        styles: {
            layout: 'horizon-sidebar',
            headerStyle: 'left',
            fontFamily: "'Playfair Display', serif",
            accent: '#ca8a04', // Gold
            sidebarBg: '#fefce8',
            sectionStyles: 'bracket',
            decor: 'gold-line'
        }
    },
    // Template 62: Violet Haze (Hybrid Zenith)
    {
        id: 'hybrid-violet',
        name: 'Violet Haze',
        category: 'Modern',
        styles: {
            layout: 'zenith-minimal',
            headerStyle: 'zenith',
            fontFamily: "'Outfit', sans-serif",
            accent: '#7c3aed', // Violet
            sectionStyles: 'zenith',
            decor: 'dots',
            backgroundColor: '#f5f3ff'
        }
    },
    // Template 63: Slate Proper (Hybrid Split)
    {
        id: 'hybrid-slate',
        name: 'Slate Proper',
        category: 'Minimal',
        styles: {
            layout: 'split-vertical',
            headerStyle: 'split',
            fontFamily: "'Inter', sans-serif",
            accent: '#475569',
            sidebarBg: '#e2e8f0',
            sectionStyles: 'caps-minimal',
            decor: 'none'
        }
    },
];

// Premium and generated templates arrays
const premiumTemplates = [];
const generatedTemplates = [];

// Combine: All replica templates + premium + generated
export const templates = [...replicaTemplates, ...premiumTemplates, ...generatedTemplates];
