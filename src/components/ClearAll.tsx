import { ClearAllButtonProps } from "../types";

export const ClearAll: React.FC<ClearAllButtonProps> = ({ handleClear }) => {
  return (
    <button
      type="button"
      onClick={handleClear}
      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      Clear all
    </button>
  );
};
