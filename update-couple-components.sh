#!/bin/bash

# Script to update couple components to use user-linked saving
# This adds useSession imports and updates saveComponentContent calls

COMPONENTS=(
    "CoupleGodExplain.jsx"
    "CoupleCoreSuggestion.jsx" 
    "EnhancedCoupleSpecificProblemSolution.jsx"
)

for component in "${COMPONENTS[@]}"; do
    file_path="src/components/$component"
    echo "Updating $component..."
    
    # Add useSession import after useState import
    sed -i '' 's/import { useState, useEffect }/import { useState, useEffect }\nimport { useSession } from "next-auth\/react";/' "$file_path"
    
    # Update saveComponentContent import
    sed -i '' 's/saveComponentContent/saveComponentContentWithUser/g' "$file_path"
    
    # Add session hook at the beginning of the component function
    # This is more complex and might need manual adjustment
    
    echo "✅ Updated $component imports"
done

echo "🎉 Component updates completed! Please manually add 'const { data: session } = useSession();' to each component and update saveComponentContent calls to include session parameter."