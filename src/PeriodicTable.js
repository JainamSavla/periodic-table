import React, { useState } from "react";
import data from "./PeriodicTableJSON.json";
import { useTheme } from "./ThemeContext";
import "./PeriodicTable.css";

const colorMap = {
  "noble gas": "#FFBC42",
  "alkaline earth metal": "#EC674E", 
  "diatomic nonmetal": "#D81159",
  "alkali metal": "#8F2D56",
  "transition metal": "#58586B",
  "post-transition metal": "#218380",
  "lanthanide": "#8E44AD",
  "metalloid": "#73D2DE",
  "actinide": "#FF6B6B",
  "polyatomic nonmetal": "#4ECDC4",
  "unknown": "#28A745"
};

const getElementColor = (category) => {
  if (category && category.startsWith('unknown')) {
    return "#28A745";
  }
  return colorMap[category] || "#95A5A6";
};

const AtomicDiagram = ({ element }) => {
  const { isDarkMode } = useTheme();
  const shells = element.shells || [];
  
  const numShells = shells.length;
  const baseRadius = 50;
  const shellSpacing = 35;
  const maxShellRadius = baseRadius + (numShells - 1) * shellSpacing;
  const labelSpace = 25;
  const padding = 30;
  
  const totalRadius = maxShellRadius + labelSpace + padding;
  const svgSize = Math.max(350, totalRadius * 2);
  const center = svgSize / 2;
  
  const colors = {
    background: isDarkMode ? '#2d2d2d' : '#f8f9fa',
    backgroundStroke: isDarkMode ? '#404040' : '#e9ecef',
    shellStroke: isDarkMode ? '#888' : '#6c757d',
    electronFill: isDarkMode ? '#4dabf7' : '#007bff',
    electronStroke: isDarkMode ? '#339af0' : '#0056b3',
    nucleus: '#dc3545',
    nucleusStroke: '#b02a37',
    text: isDarkMode ? '#ffffff' : '#212529',
    textMuted: isDarkMode ? '#b0b0b0' : '#6c757d'
  };
  
  return (
    <div className="atomic-diagram-container">
      <h3>Atomic Structure</h3>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <circle cx={center} cy={center} r={center - 10} fill={colors.background} stroke={colors.backgroundStroke} strokeWidth="2"/>
        
        {shells.map((electronCount, shellIndex) => {
          const radius = baseRadius + shellIndex * shellSpacing;
          const angleStep = (2 * Math.PI) / electronCount;
          
          return (
            <g key={shellIndex}>
              <circle 
                cx={center} 
                cy={center} 
                r={radius}
                fill="none" 
                stroke={colors.shellStroke}
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              
              {Array.from({ length: electronCount }, (_, electronIndex) => {
                const angle = electronIndex * angleStep;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                
                return (
                  <circle
                    key={electronIndex}
                    cx={x}
                    cy={y}
                    r="5"
                    fill={colors.electronFill}
                    stroke={colors.electronStroke}
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          );
        })}
        
        {/* Nucleus */}
        <circle cx={center} cy={center} r="18" fill={colors.nucleus} stroke={colors.nucleusStroke} strokeWidth="2"/>
        
        {/* Nucleus label */}
        <text x={center} y={center + 5} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
          {element.number}p⁺
        </text>
        
        {/* Element symbol */}
        <text x={center} y="30" textAnchor="middle" fontSize="24" fill={colors.text} fontWeight="bold">
          {element.symbol}
        </text>
        
        {/* Electron configuration */}
        <text x={center} y={svgSize - 20} textAnchor="middle" fontSize="13" fill={colors.textMuted}>
          {element.electron_configuration}
        </text>
      </svg>
    </div>
  );
};

const PeriodicTable = () => {
const [selectedElement, setSelectedElement] = useState(null);
const [showCategories, setShowCategories] = useState(false);
const [highlightedCategory, setHighlightedCategory] = useState(null);
const { isDarkMode, toggleTheme } = useTheme();

const handleElementClick=(element)=>{
    if(selectedElement && selectedElement.number===element.number){
        setSelectedElement(null);
    }else{
        setSelectedElement(element);
    }
}

const toggleCategories = () => {
    setShowCategories(!showCategories);
}

const handleCategoryClick = (category) => {
    if (highlightedCategory === category) {
        setHighlightedCategory(null); // Toggle off if same category
    } else {
        setHighlightedCategory(category); // Highlight new category
    }
}

// Helper function to check if an element matches the highlighted category
const isElementHighlighted = (elementCategory, highlightedCategory) => {
    if (!highlightedCategory) return false;
    
    // Handle unknown categories - if highlighting "unknown", match all categories that start with "unknown"
    if (highlightedCategory === "unknown") {
        return elementCategory && elementCategory.startsWith('unknown');
    }
    
    // For all other categories, exact match
    return elementCategory === highlightedCategory;
}

// Helper function to check if an element should be dimmed
const isElementDimmed = (elementCategory, highlightedCategory) => {
    if (!highlightedCategory) return false;
    return !isElementHighlighted(elementCategory, highlightedCategory);
}
  return (
    
    <div className={`main-content ${selectedElement ? 'sidebar-open' : ''}`}>

    <div>
        <div className="header-controls">
          <h1>Periodic Table</h1>
          <div className="header-buttons">
            <button className="categories-toggle" onClick={toggleCategories}>
              📊 Categories {showCategories ? '▼' : '▶'}
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      {showCategories && (
        <div className="legend">
          <h3>Element Categories</h3>
          <div className="legend-grid">
            {Object.entries(colorMap).map(([category, color]) => (
              <div 
                key={category} 
                className={`legend-item ${highlightedCategory === category ? 'legend-item-active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="legend-text">{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Periodic Table */}
      <div className="periodic-table">
        {data.elements.map((element) => (
          <div
            className={`element ${isElementHighlighted(element.category, highlightedCategory) ? 'element-highlighted' : ''} ${isElementDimmed(element.category, highlightedCategory) ? 'element-dimmed' : ''}`}
            key={element.name}
            data-category={element.category}
            onClick={() => handleElementClick(element)}
            style={{
              gridRow: element.ypos,
              gridColumn: element.xpos,
              borderColor: getElementColor(element.category),
            }}
          >
            <strong>{element.symbol}</strong>
            <small className="number">{element.number}</small>
            <small className="name">{element.name}</small>
          </div>
        ))}
      </div>
       {selectedElement && (
        <div className="sidebar">
          <div className="sidebar-content">
            <button className="close-btn" onClick={() => setSelectedElement(null)}>×</button>
            
            <div className="element-header">
              <h1>{selectedElement.name}</h1>
              <div className="element-symbol">{selectedElement.symbol}</div>
            </div>

            {/* Atomic Structure Diagram */}
            <AtomicDiagram element={selectedElement} />

            <div className="properties-section">
              <h3>General Properties</h3>
              <div className="property-grid">
                <div className="property">
                  <span className="label">Atomic Number:</span>
                  <span className="value">{selectedElement.number}</span>
                </div>
                <div className="property">
                  <span className="label">Period:</span>
                  <span className="value">Period {selectedElement.period}</span>
                </div>
                <div className="property">
                  <span className="label">Category:</span>
                  <span className="value">{selectedElement.category}</span>
                </div>
                <div className="property">
                  <span className="label">Standard Atomic Weight:</span>
                  <span className="value">{selectedElement.atomic_mass} u</span>
                </div>
                <div className="property">
                  <span className="label">Melting Point:</span>
                  <span className="value">{selectedElement.melt ? `${selectedElement.melt} K` : 'Unknown'}</span>
                </div>
                <div className="property">
                  <span className="label">Boiling Point:</span>
                  <span className="value">{selectedElement.boil ? `${selectedElement.boil} K` : 'Unknown'}</span>
                </div>
                <div className="property">
                  <span className="label">Phase at STP:</span>
                  <span className="value">{selectedElement.phase}</span>
                </div>
                <div className="property">
                  <span className="label">Density:</span>
                  <span className="value">{selectedElement.density ? `${selectedElement.density} g/cm³` : 'Unknown'}</span>
                </div>
              </div>
            </div>

            <div className="properties-section">
              <h3>Additional Properties</h3>
              <div className="property-grid">
                <div className="property">
                  <span className="label">Electron Configuration:</span>
                  <span className="value">{selectedElement.electron_configuration}</span>
                </div>
                <div className="property">
                  <span className="label">Electrons per Shell:</span>
                  <span className="value">{selectedElement.shells ? selectedElement.shells.join(', ') : 'Unknown'}</span>
                </div>
                <div className="property">
                  <span className="label">Electronegativity:</span>
                  <span className="value">{selectedElement.electronegativity_pauling || 'Unknown'}</span>
                </div>
                <div className="property">
                  <span className="label">Discovered by:</span>
                  <span className="value">{selectedElement.discovered_by || 'Unknown'}</span>
                </div>
                <div className="property">
                  <span className="label">Appearance:</span>
                  <span className="value">{selectedElement.appearance || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {selectedElement.summary && (
              <div className="properties-section">
                <h3>Summary</h3>
                <p className="summary-text">{selectedElement.summary}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
</div>
  );
};

export default PeriodicTable;