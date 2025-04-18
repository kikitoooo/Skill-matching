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
  if (!resume || !resume.skills) {
    return <p>Нет данных для отображения диаграммы навыков</p>;
  }

  const normalizedSkills = (
    Array.isArray(resume.skills)
      ? resume.skills
      : Object.entries(resume.skills).map(([name, level]) => ({
          name,
          level: Number(level),
        }))
  ).map((skill, index) => ({
    ...skill,
    indexLabel: index + 1,
  }));
  const getColorByLevel = (level: number) => {
    if (level >= 80) return "#28a745";
    if (level >= 50) return "#ffc107";
    return "#dc3545";
  };

  return (
    <ResponsiveContainer width="100%" height={normalizedSkills.length * 25}>
      <BarChart
        data={normalizedSkills}
        layout="horizontal"
        margin={{ top: 10, bottom: -20, left: -30, right: 5 }}
      >
        <CartesianGrid stroke="rgb(22, 34, 151, 0.5)" strokeDasharray="3 3" />
        <XAxis
          dataKey="indexLabel"
          type="category"
          tick={{ fontSize: 14, dx: 0, dy: 10 }}
          angle={0}
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
          labelFormatter={(_, payload: any) =>
            `Навык: ${payload?.[0]?.payload?.name ?? ""}`
          }
        />
        <Bar dataKey="level" radius={[8, 8, 0, 0]}>
          {normalizedSkills.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorByLevel(entry.level)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
