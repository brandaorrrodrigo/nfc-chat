interface MetricCardProps {
  title: string
  value: string | number
  icon: string
  color: 'cyan' | 'purple' | 'green' | 'yellow'
  trend?: string
}

const colorClasses = {
  cyan: 'from-cyan-500 to-blue-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-green-500 to-emerald-500',
  yellow: 'from-yellow-500 to-orange-500'
}

export function MetricCard({ title, value, icon, color, trend }: MetricCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${
            trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend}
          </span>
          <span className="text-xs text-gray-500">vs. ontem</span>
        </div>
      )}
    </div>
  )
}
