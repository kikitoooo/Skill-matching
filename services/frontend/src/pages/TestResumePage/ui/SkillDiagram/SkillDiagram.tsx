import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { TResume } from "../../../../entities/models/types";

export type SkillDiagramProps = {
  resume: TResume;
};

export const SkillDiagram: React.FC<SkillDiagramProps> = ({ resume }) => {
  const getColorByLevel = (level: number) => {
    if (level >= 80) return "#28a745"; // зеленый
    if (level >= 50) return "#ffc107"; // жёлтый
    return "#dc3545"; // красный
  };
  return (
    <ResponsiveContainer
      width="100%"
      height={Math.max(resume.skills.length * 60, 250)}
    >
      <BarChart
        data={resume.skills}
        layout="horizontal"
        margin={{ top: 10, bottom: 10, left: -30, right: 5 }}
      >
        <CartesianGrid stroke="rgb(22, 34, 151, 0.5)" strokeDasharray="3 3" />

        <XAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 14, dx: 0, dy: 10 }}
          angle={-40}
          interval={0}
          height={60}
          stroke="#162297"
        />
        <YAxis
          type="number"
          domain={[0, 100]}
          tickMargin={0}
          tick={{ fontSize: 14, dx: 0, dy: 0 }}
          stroke="#162297"
        />

        <Tooltip
          formatter={(value: number) => [`${value}%`, "Уровень"]}
          labelFormatter={(name) => `Навык: ${name}`}
        />
        <Bar dataKey="level" radius={[8, 8, 0, 0]}>
          {resume.skills.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorByLevel(entry.level)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
