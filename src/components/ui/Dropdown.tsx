'use client';

import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  error?: string;
  placeholder?: string;
  id: string;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  multiple = false,
  error,
  placeholder = 'Select an option',
  id,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === 'string' && value
      ? [value]
      : [];

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (multiple) {
      const updatedValues = selectedValues.includes(option.value)
        ? selectedValues.filter((item) => item !== option.value)
        : [...selectedValues, option.value];

      onChange(updatedValues);
      setSearch('');
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearch('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter' && isOpen && filteredOptions[highlightedIndex]) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }

    if (
      e.key === 'Backspace' &&
      multiple &&
      !search &&
      selectedValues.length > 0
    ) {
      onChange(selectedValues.slice(0, -1));
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(selectedValues.filter((item) => item !== optionValue));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-[var(--color-text)]"
      >
        {label}
      </label>

      <div
        // className={`flex min-h-[46px] w-full items-center gap-2 rounded-lg border bg-white px-4 py-2 transition-all
        className={`flex min-h-[46px] w-full items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-[var(--color-text)] transition-all
            ${
              error
                ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-100'
                : 'border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-blue-100'
            } ${disabled ? 'cursor-not-allowed bg-slate-50 opacity-60' : ''}`}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {multiple &&
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-[var(--color-primary)]"
              >
                {option.label}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemove(option.value)}
                  className="hover:text-red-500"
                  aria-label={`Remove ${option.label}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}

          <input
            id={id}
            type="text"
            // value={search}
            value={isOpen ? search : (selectedOptions[0]?.label ?? '')}
            disabled={disabled}
            placeholder={
              multiple
                ? selectedValues.length
                  ? 'Add another...'
                  : placeholder
                : selectedOptions[0]?.label || placeholder
            }
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            // className="min-w-0 flex-1 py-1 text-sm text-[var(--color-text)] outline-none placeholder:text-slate-400"
            className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            autoComplete="off"
            aria-invalid={!!error}
            aria-expanded={isOpen}
            aria-controls={`${id}-options`}
            role="combobox"
          />
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="shrink-0 text-slate-400 hover:text-[var(--color-primary)]"
          aria-label="Toggle dropdown"
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && !disabled && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-multiselectable={multiple}
          //   className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-xl"
        >
          {filteredOptions.length > 0 ? (
            // filteredOptions.map((option) => {
            filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  //   className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-blue-50 ${
                  //     isSelected
                  //       ? "bg-blue-50 font-medium text-[var(--color-primary)]"
                  //       : "text-[var(--color-text)]"
                  //   }`}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                    highlightedIndex === index
                      ? 'bg-blue-50'
                      : 'hover:bg-slate-50'
                  } ${
                    isSelected
                      ? 'font-semibold text-blue-700'
                      : 'font-medium text-slate-700'
                  }`}
                  //                 className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                  //   highlightedIndex === index
                  //     ? "bg-blue-50"
                  //     : "hover:bg-blue-50"
                  // } ${
                  //   isSelected
                  //     ? "font-medium text-[var(--color-primary)]"
                  //     : "text-[var(--color-text)]"
                  // }`}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <Check size={16} className="text-[var(--color-primary)]" />
                  )}
                </button>
              );
            })
          ) : (
            <p className="px-4 py-3 text-sm text-slate-400">
              No options found.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

// "use client";

// import { SelectHTMLAttributes } from "react";

// export interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface DropdownProps
//   extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "multiple"> {
//   label: string;
//   options: DropdownOption[];
//   value: string | string[];
//   onChange: (value: string | string[]) => void;
//   multiple?: boolean;
//   error?: string;
//   placeholder?: string;
// }

// export default function Dropdown({
//   label,
//   options,
//   value,
//   onChange,
//   multiple = false,
//   error,
//   placeholder = "Select an option",
//   className = "",
//   id,
//   ...props
// }: DropdownProps) {
//   return (
//     <div>
//       <label
//         htmlFor={id}
//         className="mb-2 block text-sm font-semibold text-[var(--color-text)]"
//       >
//         {label}
//       </label>

//       <select
//         {...props}
//         id={id}
//         multiple={multiple}
//         value={value}
//         onChange={(e) => {
//           if (multiple) {
//             onChange(
//               Array.from(e.target.selectedOptions, (option) => option.value)
//             );
//           } else {
//             onChange(e.target.value);
//           }
//         }}
//         aria-invalid={!!error}
//         aria-describedby={error ? `${id}-error` : undefined}
//         className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-all ${
//           error
//             ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
//             : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
//         } ${multiple ? "min-h-32" : ""} ${className}`}
//       >
//         {!multiple && (
//           <option value="" disabled>
//             {placeholder}
//           </option>
//         )}

//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>

//       {error && (
//         <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-500">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }
