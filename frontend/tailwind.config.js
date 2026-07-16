export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.18)',
      },
      colors: {
        surface: '#111827',
        panel: '#1F2937',
        backdrop: '#0B1220',
        primary: '#2563EB',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',
      },
      borderRadius: {
        base: '12px',
      },
      boxShadow: {
        glow: '0 20px 50px rgba(37, 99, 235, 0.12)',
      },
    },
  },
  plugins: [],
};
