import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF'];

function MiGrafico({ data, titulo }) {
  return (
    <div style={{ margin: '2rem' }}>
      <h3>{titulo}</h3>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%" cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default MiGrafico;
