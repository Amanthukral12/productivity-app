const ProgressCircle = ({
  progress = 0,
  progressColor,
}: {
  progress: number;
  progressColor: string;
}) => {
  const strokeDasharray = 2 * Math.PI * 70;
  const strokeDashoffset = strokeDasharray * ((100 - progress) / 100);
  return (
    <svg
      width="100"
      height="100"
      viewBox="-20 -20 200 200"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        r="70"
        cx="80"
        cy="80"
        fill="transparent"
        stroke="#e0e0e0"
        strokeWidth="16px"
      ></circle>
      <circle
        r="70"
        cx="80"
        cy="80"
        stroke={progressColor}
        strokeWidth="16px"
        strokeLinecap="round"
        strokeDashoffset={`${strokeDashoffset}px`}
        fill="transparent"
        strokeDasharray={`${strokeDasharray}px`}
      ></circle>
      <text
        x="80"
        y="80"
        fill={progressColor}
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        transform="rotate(90, 80, 80)"
      >
        {progress ? `${progress}%` : "0%"}
      </text>
    </svg>
  );
};

export default ProgressCircle;
