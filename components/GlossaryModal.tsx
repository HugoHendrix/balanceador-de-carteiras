
import React, { useState, useMemo } from 'react';
import { glossaryData } from '../data/glossaryData';
import { BookOpenIcon, XIcon } from './icons';

interface GlossaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGlossary = useMemo(() => {
        if (!searchTerm) {
            return glossaryData;
        }
        return glossaryData.filter(item =>
            item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BookOpenIcon className="w-7 h-7 text-secondary" />
                        <h2 className="text-xl font-bold text-white">Glossário Financeiro</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-5">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar termo..."
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 text-base focus:ring-primary focus:border-primary transition"
                    />
                </div>

                <div className="px-5 pb-5 overflow-y-auto flex-grow">
                    {filteredGlossary.length > 0 ? (
                        <div className="space-y-4">
                            {filteredGlossary.map(item => (
                                <div key={item.term} className="bg-gray-900/50 p-4 rounded-lg">
                                    <h3 className="font-bold text-primary">{item.term}</h3>
                                    <p className="text-sm text-gray-300 mt-1">{item.definition}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-8">Nenhum termo encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlossaryModal;
