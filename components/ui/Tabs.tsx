'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

export interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="border-b  border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={clsx(
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                {
                  'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300': activeTab === index,
                  'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300': activeTab !== index,
                }
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">{tabs[activeTab] && tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;

