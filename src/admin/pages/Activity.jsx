import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ActivityStatCard from '../components/activity/ActivityStatCard'
import ActivityList from '../components/activity/ActivityList'
import ActivityInsightCard from '../components/activity/ActivityInsightCard'

export default function Activity() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('activity_log')
      .select(
        `
        id_log,
        accion,
        descripcion,
        fecha,
        usuario:usuario_id (
          nombre
        )
      `
      )
      .order('fecha', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error cargando logs:', error)
      setError('No se pudo cargar la actividad del sistema.')
      setLoading(false)
      return
    }

    const formatted = (data || []).map(log => ({
      id: log.id_log,
      type: log.accion || 'general',
      description: log.descripcion || 'Sin descripción',
      date: log.fecha,
      user: log.usuario?.nombre || 'Sistema',
    }))

    setLogs(formatted)
    setLoading(false)
  }

  const activityStats = useMemo(() => {
    const today = new Date()

    const isToday = dateString => {
      const date = new Date(dateString)
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }

    return {
      total: logs.length,
      today: logs.filter(log => isToday(log.date)).length,
      errors: logs.filter(log => log.type === 'system_error').length,
      userActions: logs.filter(log => log.type.startsWith('user_')).length,
    }
  }, [logs])

  const filteredLogs = useMemo(() => {
    if (selectedType === 'all') return logs
    return logs.filter(log => log.type === selectedType)
  }, [logs, selectedType])

  const availableTypes = useMemo(() => {
    const types = [...new Set(logs.map(log => log.type))]
    return types
  }, [logs])

  const systemStatus = activityStats.errors > 0 ? 'warning' : 'ok'
  const uptime = '99.8%'
  const activeAlerts = activityStats.errors

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-[#0F172A]">
          Actividad del Sistema
        </h1>
        <p className="mt-3 text-[18px] text-[#6B7280]">
          Monitorea todos los eventos y acciones de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActivityStatCard
          label="Eventos totales"
          value={activityStats.total}
          valueColor="text-[#111827]"
          className="p-2 text-sm"
        />
        <ActivityStatCard
          label="Actividad hoy"
          value={activityStats.today}
          valueColor="text-[#3B82F6]"
          className="p-2 text-sm"
        />
        <ActivityStatCard
          label="Errores del sistema"
          value={activityStats.errors}
          valueColor="text-[#EF4444]"
          className="p-2 text-sm"
        />
        <ActivityStatCard
          label="Acciones de usuario"
          value={activityStats.userActions}
          valueColor="text-[#22C55E]"
          className="p-2 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-8 py-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[28px] font-bold text-[#0F172A]">Actividad Reciente</h2>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(prev => !prev)}
              className="rounded-[16px] bg-[#F3F4F6] px-6 py-3 text-[16px] font-semibold text-[#374151] transition hover:bg-[#E5E7EB]"
            >
              Filtrar
            </button>

            <button
              type="button"
              onClick={fetchLogs}
              className="rounded-[16px] bg-[#FF2D55] px-6 py-3 text-[16px] font-semibold text-white transition hover:opacity-90"
            >
              Exportar
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="border-b border-[#E5E7EB] bg-[#FAFAFA] px-8 py-5">
            <div className="flex flex-col gap-3 md:max-w-xs">
              <label className="text-sm font-medium text-[#6B7280]">Tipo de evento</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="h-[48px] rounded-[14px] border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] outline-none focus:border-[#FF2D55]"
              >
                <option value="all">Todos</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {formatTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="px-8 py-8">
          {loading ? (
            <div className="rounded-[20px] border border-[#E5E7EB] bg-[#FAFAFA] px-6 py-12 text-center text-[#6B7280]">
              Cargando actividad...
            </div>
          ) : error ? (
            <div className="rounded-[20px] border border-red-200 bg-red-50 px-6 py-12 text-center">
              <p className="text-[16px] font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={fetchLogs}
                className="mt-4 rounded-[14px] bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <ActivityList logs={filteredLogs} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <ActivityInsightCard
          type="success"
          title="Sistema Operativo"
          mainValue="Todos los servicios funcionando correctamente"
          subtitle="Última verificación: hace 2 minutos"
          status={systemStatus}
        />

        <ActivityInsightCard
          type="info"
          title="Uptime"
          mainValue={uptime}
          subtitle="Últimos 30 días"
        />

        <ActivityInsightCard
          type="danger"
          title="Alertas Activas"
          mainValue={String(activeAlerts)}
          subtitle="Requieren atención"
        />
      </div>
    </div>
  )
}

function formatTypeLabel(type) {
  return type.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
}
