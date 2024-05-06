import React, { useEffect, useRef, useState } from 'react';
import styles from './select.module.css'

export type SelectOption = {
    label: string;
    value: string | number;
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, value, onChange, options }: SelectProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const [highlightedOption, setHighlightedOption] = useState<number>(0)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) setHighlightedOption(0)
    }, [isOpen])

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined);
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target !== containerRef.current) return;
            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setIsOpen(prev => !prev);
                    if (isOpen) selectOption(options[highlightedOption])
                    break;
                case 'ArrowDown':
                case 'ArrowUp': {
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }
                    const newValue = highlightedOption + (e.code === 'ArrowDown' ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedOption(newValue)
                    }
                    break;
                }
                case 'Escape':
                    setIsOpen(false);
                    break;
            }

        }
        containerRef.current?.addEventListener('keydown', handler);

        return () => {
            containerRef.current?.removeEventListener('keydown', handler)
        }

    }, [isOpen, highlightedOption, options])


    const selectOption = (option: SelectOption) => {
        if (multiple) {
            const optionIndex = value.findIndex((v) => v.value === option.value);
            if (optionIndex !== -1) {
                onChange(value.filter((_, index) => index !== optionIndex));
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option)
        }
    }

    const isOptionSelected = (option: SelectOption) => {
        return multiple ? value.some(v => v.value === option.value) : option.value === value?.value
    }

    return (
        <div className={styles.container} ref={containerRef}
            tabIndex={0}
            onClick={() => setIsOpen(prev => !prev)}
            onBlur={() => setIsOpen(false)}>
            <span className={styles.value}>{multiple ? value.map(v => (
                <button
                    key={v.value}
                    className={styles["option-badge"]}
                >
                    {v.label}
                    <span
                        onClick={e => {
                            e.stopPropagation()
                            selectOption(v)
                        }} className={styles["remove-btn"]}>&times;</span>
                </button>
            ))
                : value?.label}</span>
            <button onClick={e => {
                e.stopPropagation();
                clearOptions();
            }} className={styles['clear-btn']}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}>
                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
            </div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
                {options.map((option, index) => (
                    <li
                        onClick={e => {
                            e.stopPropagation();
                            selectOption(option);
                            setIsOpen(false)
                        }}
                        onMouseEnter={() => setHighlightedOption(index)}
                        className={`${styles.option} 
                        ${isOptionSelected(option) ? styles.selected : ''}
                        ${index === highlightedOption ? styles.highlighted : ''}`}
                        key={option.value}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Select