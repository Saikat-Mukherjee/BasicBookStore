export default function SectionTitle({ icon, title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h3>
      {action}
    </div>
  );
}
