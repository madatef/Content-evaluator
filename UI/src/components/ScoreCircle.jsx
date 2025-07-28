export default function ScoreCircle({ score, size = 32 }) {
    const radius = size / 2 - 2;
    const centerX = size / 2;
    const centerY = size / 2;
    const color = "#1e40af"; // Even darker blue color (blue-700)
    
    // Map score 0–4 → angle in radians (0 to 2π)
    const fillPercent = Math.min(score / 4, 1);
    const angle = fillPercent * 2 * Math.PI;
    
    // Calculate the end point of the arc
    const endX = centerX + radius * Math.sin(angle);
    const endY = centerY - radius * Math.cos(angle);
    
    // Determine if we need to use the large-arc-flag (1 for angles > π, 0 otherwise)
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    // Handle different cases based on score
    if (score === 0) {
      // Empty circle with border only
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="1.5" 
          />
        </svg>
      );
    } else if (Math.abs(fillPercent - 1) < 0.001) {
      // Full circle
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill={color} 
          />
        </svg>
      );
    } else {
      // Partial pie chart
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="1.5" 
          />
          <path 
            d={`M ${centerX} ${centerY}
            L ${centerX} ${centerY - radius}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z`}
            fill={color} 
          />
        </svg>
      );
    }
  }