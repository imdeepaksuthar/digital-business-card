import React from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/Button';

interface DynamicListProps<T> {
    title: string;
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    onAdd: () => void;
    onEdit?: (item: T, index: number) => void;
    onDelete?: (item: T, index: number) => void;
    addButtonLabel?: string;
}

export function DynamicList<T>({
    title,
    items = [],
    renderItem,
    onAdd,
    onEdit,
    onDelete,
    addButtonLabel = "Add Item"
}: DynamicListProps<T>) {
    return (
        <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">{title}</h4>
                </div>

                {/* List Items */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {items.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No items added yet.
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                <div className="flex-1 mr-4">
                                    {renderItem(item, index)}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item, index)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={() => onDelete(item, index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full border-dashed border-2 border-slate-300 hover:border-blue-400 hover:text-blue-600"
                        onClick={onAdd}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {addButtonLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
