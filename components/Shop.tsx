import React from 'react';
import Modal from './Modal';
import { GemIcon } from './icons';
import { ShopItem } from '../types';

interface ShopProps {
  show: boolean;
  onClose: () => void;
  gems: number;
  items: ShopItem[];
  onPurchase: (itemId: string) => void;
}

const Shop: React.FC<ShopProps> = ({ show, onClose, gems, items, onPurchase }) => {
  return (
    <Modal title="Tienda" show={show} onClose={onClose}>
      <div className="flex flex-col">
        {/* Gem Balance */}
        <div className="flex justify-center items-center mb-6 bg-cyan-50 border border-cyan-200 rounded-lg py-2">
            <p className="font-bold text-slate-600 mr-2">Tus Gemas:</p>
            <div className="flex items-center">
                <GemIcon className="w-8 h-8 text-cyan-500" />
                <span className="text-2xl font-display text-slate-700 ml-1">{gems.toLocaleString()}</span>
            </div>
        </div>

        {/* Shop Items */}
        <div className="space-y-4">
            {items.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-md shadow-sm">
                           <item.icon className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onPurchase(item.id)}
                        disabled={gems < item.cost}
                        className="flex items-center bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-md hover:bg-yellow-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                    >
                        <GemIcon className="w-5 h-5 mr-1" />
                        {item.cost}
                    </button>
                </div>
            ))}
        </div>

      </div>
    </Modal>
  );
};

export default Shop;
