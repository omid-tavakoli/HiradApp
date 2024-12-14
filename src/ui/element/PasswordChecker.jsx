import { memo } from "react";

const PasswordChecker = memo(({ password }) => {
  const setScore = (pass) => {
    const matchedCase = ["[a-z]", "[A-Z]", "[0-9]", "[$@$!%*#?&]"];
    let score = 0;
    for (const reg of matchedCase) {
      if (new RegExp(reg).test(pass)) score += 1;
    }
    score += Math.floor(pass.length / 8);

    return score;
  };

  const passwordScore = setScore(password);

  return (
    <div className="flex -mx-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-1/5 px-1">
          <div
            className={`h-2 rounded-xl transition-colors ${
              i < passwordScore
                ? passwordScore <= 2
                  ? "bg-red-400"
                  : passwordScore <= 4
                  ? "bg-yellow-400"
                  : "bg-green-500"
                : "bg-gray-200"
            }`}
          ></div>
        </div>
      ))}
    </div>
  );
});

export default PasswordChecker;
