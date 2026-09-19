import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";

interface WrapperProps {
  label?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, hint, required, className, children }: WrapperProps) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, required, className, ...props }: InputProps) {
  return (
    <FieldWrapper label={label} hint={hint} required={required}>
      <input required={required} className={cn(fieldBase, className)} {...props} />
    </FieldWrapper>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, required, className, ...props }: TextareaProps) {
  return (
    <FieldWrapper label={label} hint={hint} required={required}>
      <textarea required={required} className={cn(fieldBase, "min-h-[90px] resize-y", className)} {...props} />
    </FieldWrapper>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export function Select({ label, hint, required, className, children, ...props }: SelectProps) {
  return (
    <FieldWrapper label={label} hint={hint} required={required}>
      <select required={required} className={cn(fieldBase, "cursor-pointer", className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}
