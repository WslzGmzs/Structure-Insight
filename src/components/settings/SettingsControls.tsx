import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
}

export const Toggle = ({ checked, onChange, label, id }: ToggleProps) => (
  <button
    id={id}
    type="button"
    aria-label={label}
    aria-pressed={checked}
    onClick={onChange}
    className={[
      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-950',
      checked
        ? 'border-primary/30 bg-primary shadow-sm shadow-primary/25'
        : 'border-light-border bg-light-panel dark:border-dark-border dark:bg-slate-800',
    ].join(' ')}
  >
    <span
      className={[
        'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-6' : 'translate-x-1',
      ].join(' ')}
    />
  </button>
);

interface SectionGroupProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export const SectionGroup = ({ title, icon, children }: SectionGroupProps) => (
  <section className="py-2">
    <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-light-subtle-text dark:text-dark-subtle-text">
      {icon ? <i className={`fa-solid ${icon} w-3.5 text-center`} /> : null}
      {title}
    </h4>
    <div className="divide-y divide-light-border/80 rounded-2xl border border-light-border/80 bg-light-panel px-4 dark:divide-dark-border/80 dark:border-dark-border/80 dark:bg-slate-900">
      {children}
    </div>
  </section>
);

interface SettingsRowProps {
  label: string;
  description?: string;
  control?: React.ReactNode;
  children?: React.ReactNode;
  stacked?: boolean;
}

export const SettingsRow = ({ label, description, control, children, stacked = false }: SettingsRowProps) => (
  <div className="py-3">
    <div className={stacked ? 'space-y-3' : 'flex items-start justify-between gap-4'}>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-light-text dark:text-dark-text">{label}</div>
        {description ? (
          <p className="mt-0.5 text-xs leading-5 text-light-subtle-text dark:text-dark-subtle-text">{description}</p>
        ) : null}
      </div>
      {!stacked && control ? <div className="shrink-0">{control}</div> : null}
    </div>
    {stacked && children ? <div className="mt-3">{children}</div> : null}
    {!stacked && children ? <div className="mt-3">{children}</div> : null}
  </div>
);

interface FieldProps {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  min?: number;
}

export const Field = ({
  id,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  type = 'text',
  min,
}: FieldProps) => {
  const className =
    'w-full rounded-lg border border-light-border bg-light-bg px-3 py-2.5 text-sm text-light-text outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-slate-950 dark:text-dark-text';

  if (multiline) {
    return (
      <textarea
        id={id}
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`${className} resize-y`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      id={id}
      type={type}
      min={min}
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
      className={className}
      placeholder={placeholder}
    />
  );
};
