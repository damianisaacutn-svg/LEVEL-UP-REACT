import { useEffect, useMemo, useState } from 'react'
import { Save, Shield, Mail, Trophy, Database, Lock, Bell, Globe } from 'lucide-react'

import SettingsSectionCard from '../components/settings/SettingsSectionCard'
import SettingsToggle from '../components/settings/SettingsToggle'
import SettingsInput from '../components/settings/SettingsInput'
import BackupStatusCard from '../components/settings/BackupStatusCard'
import DangerZone from '../components/settings/DangerZone'

import {
  getSystemSettings,
  updateSystemSettings,
  createBackupMark,
  resetSystemSettings,
} from '../services/settingsService'

const emptySettings = {
  id: null,
  platformName: 'Level Up',
  platformDescription: 'Plataforma educativa interactiva',
  platformUrl: 'https://levelup.platform',

  notifyNewUsers: true,
  notifySystemErrors: true,
  notifyNewCourses: false,
  notifyInstructorActivity: true,

  xpLesson: 50,
  xpQuiz: 100,
  xpCourse: 500,
  streakReward: 25,

  sessionDuration: 60,
  minimumPasswordLength: 8,
  twoFactorRequired: false,
  maintenanceNotifications: true,

  lastBackup: null,
  systemStatus: 'operativo',
}

function formatBackupDate(dateValue) {
  if (!dateValue) return 'Sin respaldos registrados'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return 'Fecha inválida'

  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getRelativeBackupText(dateValue) {
  if (!dateValue) return 'Sin backup'

  const now = new Date()
  const backupDate = new Date(dateValue)
  const diffMs = now - backupDate

  if (Number.isNaN(backupDate.getTime())) return 'Fecha inválida'

  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Hace unos segundos'
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
}

export default function Settings() {
  const [settings, setSettings] = useState(emptySettings)
  const [initialSettings, setInitialSettings] = useState(emptySettings)
  const [savedMessage, setSavedMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(initialSettings)
  }, [settings, initialSettings])

  const updateField = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    let mounted = true

    const loadSettings = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const data = await getSystemSettings()

        if (!mounted) return

        setSettings(data)
        setInitialSettings(data)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error.message || 'No se pudo cargar la configuración del sistema.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      mounted = false
    }
  }, [])

  const showTemporaryMessage = (setter, message) => {
    setter(message)
    setTimeout(() => setter(''), 3000)
  }

  const validateSettings = () => {
    if (!settings.platformName.trim()) {
      throw new Error('El nombre de la plataforma es obligatorio.')
    }

    if (!settings.platformUrl.trim()) {
      throw new Error('La URL de la plataforma es obligatoria.')
    }

    if (Number(settings.minimumPasswordLength) < 6) {
      throw new Error('La contraseña mínima debe ser de al menos 6 caracteres.')
    }

    if (Number(settings.sessionDuration) < 5) {
      throw new Error('La duración de sesión debe ser de al menos 5 minutos.')
    }

    const numericFields = ['xpLesson', 'xpQuiz', 'xpCourse', 'streakReward']
    for (const field of numericFields) {
      if (Number(settings[field]) < 0) {
        throw new Error('Los valores de XP y recompensas no pueden ser negativos.')
      }
    }
  }

  const handleSave = async () => {
    try {
      validateSettings()
      setSaving(true)
      setErrorMessage('')

      const updated = await updateSystemSettings(settings)

      setSettings(updated)
      setInitialSettings(updated)
      showTemporaryMessage(setSavedMessage, 'Los cambios se guardaron correctamente.')
    } catch (error) {
      showTemporaryMessage(setErrorMessage, error.message || 'No se pudo guardar la configuración.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setSettings(initialSettings)
    showTemporaryMessage(setSavedMessage, 'Los cambios fueron descartados.')
  }

  const handleCreateBackup = async () => {
    try {
      setSaving(true)
      setErrorMessage('')

      const updated = await createBackupMark(settings.id)

      setSettings(updated)
      setInitialSettings(updated)
      showTemporaryMessage(
        setSavedMessage,
        'Se registró correctamente la fecha del nuevo respaldo.'
      )
    } catch (error) {
      showTemporaryMessage(setErrorMessage, error.message || 'No se pudo actualizar el respaldo.')
    } finally {
      setSaving(false)
    }
  }

  const handleRestoreBackup = () => {
    showTemporaryMessage(setSavedMessage, 'La restauración aún no está implementada en backend.')
  }

  const handleResetSettings = async () => {
    try {
      setSaving(true)
      setErrorMessage('')

      const updated = await resetSystemSettings(settings.id)

      setSettings(updated)
      setInitialSettings(updated)
      showTemporaryMessage(
        setSavedMessage,
        'La configuración volvió a sus valores predeterminados.'
      )
    } catch (error) {
      showTemporaryMessage(
        setErrorMessage,
        error.message || 'No se pudo restablecer la configuración.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#EAEAEA] p-6">
        <p className="text-[14px] text-[#8A8A8A]">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">Configuración</h1>
          <p className="text-[16px] text-[#8A8A8A]">
            Administra los parámetros generales, seguridad, notificaciones y gamificación de la
            plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[13px] text-[#4A4A4A] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#3A86FF]" />
            Panel administrativo activo
          </div>

          <div className="px-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[13px] text-[#4A4A4A] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FFB703]" />
            Estado: {settings.systemStatus}
          </div>
        </div>
      </div>

      {savedMessage ? (
        <div className="bg-[#FFF5F7] border border-[#FFD6DF] text-[#C81E4D] rounded-xl px-4 py-3 text-[14px] font-medium">
          {savedMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="bg-[#FFF5F5] border border-[#F8D7DA] text-[#B42318] rounded-xl px-4 py-3 text-[14px] font-medium">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SettingsSectionCard
          icon={Shield}
          iconBg="bg-[#FFF5F7]"
          iconColor="text-[#FF2D55]"
          title="Configuración general"
          description="Parámetros base de la plataforma educativa."
        >
          <SettingsInput
            label="Nombre de la plataforma"
            value={settings.platformName}
            onChange={value => updateField('platformName', value)}
          />

          <SettingsInput
            label="Descripción"
            value={settings.platformDescription}
            onChange={value => updateField('platformDescription', value)}
            textarea
            rows={3}
          />

          <SettingsInput
            label="URL del sitio"
            value={settings.platformUrl}
            onChange={value => updateField('platformUrl', value)}
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Mail}
          iconBg="bg-[#EFF6FF]"
          iconColor="text-[#3A86FF]"
          title="Notificaciones"
          description="Configura alertas administrativas y eventos del sistema."
        >
          <SettingsToggle
            title="Nuevos registros"
            description="Notificar cuando un nuevo usuario se registre en la plataforma."
            checked={settings.notifyNewUsers}
            onChange={value => updateField('notifyNewUsers', value)}
          />

          <SettingsToggle
            title="Errores del sistema"
            description="Recibir alertas cuando exista una incidencia crítica."
            checked={settings.notifySystemErrors}
            onChange={value => updateField('notifySystemErrors', value)}
          />

          <SettingsToggle
            title="Nuevos cursos"
            description="Notificar cuando un instructor publique un nuevo curso."
            checked={settings.notifyNewCourses}
            onChange={value => updateField('notifyNewCourses', value)}
          />

          <SettingsToggle
            title="Actividad de instructores"
            description="Alertar sobre acciones relevantes en la gestión de contenido."
            checked={settings.notifyInstructorActivity}
            onChange={value => updateField('notifyInstructorActivity', value)}
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Trophy}
          iconBg="bg-[#F5F3FF]"
          iconColor="text-[#7B61FF]"
          title="Gamificación"
          description="Ajusta la asignación de XP y recompensas por actividad."
        >
          <SettingsInput
            label="XP por lección completada"
            type="number"
            value={settings.xpLesson}
            min={0}
            onChange={value => updateField('xpLesson', value)}
          />

          <SettingsInput
            label="XP por quiz aprobado"
            type="number"
            value={settings.xpQuiz}
            min={0}
            onChange={value => updateField('xpQuiz', value)}
          />

          <SettingsInput
            label="XP por curso completado"
            type="number"
            value={settings.xpCourse}
            min={0}
            onChange={value => updateField('xpCourse', value)}
          />

          <SettingsInput
            label="Recompensa por racha diaria"
            type="number"
            value={settings.streakReward}
            min={0}
            onChange={value => updateField('streakReward', value)}
            helperText="Esta recompensa se otorga al mantener continuidad en el aprendizaje."
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Lock}
          iconBg="bg-[#FFF7ED]"
          iconColor="text-[#F39C12]"
          title="Seguridad"
          description="Opciones de acceso y protección del entorno administrativo."
        >
          <SettingsInput
            label="Duración de sesión (minutos)"
            type="number"
            value={settings.sessionDuration}
            min={5}
            onChange={value => updateField('sessionDuration', value)}
          />

          <SettingsInput
            label="Longitud mínima de contraseña"
            type="number"
            value={settings.minimumPasswordLength}
            min={6}
            onChange={value => updateField('minimumPasswordLength', value)}
          />

          <SettingsToggle
            title="Autenticación adicional requerida"
            description="Solicita una capa extra de validación para accesos administrativos."
            checked={settings.twoFactorRequired}
            onChange={value => updateField('twoFactorRequired', value)}
          />

          <SettingsToggle
            title="Notificaciones de mantenimiento"
            description="Mostrar avisos al equipo cuando existan cambios sensibles en la configuración."
            checked={settings.maintenanceNotifications}
            onChange={value => updateField('maintenanceNotifications', value)}
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Database}
          iconBg="bg-[#F0FFF4]"
          iconColor="text-[#2ECC71]"
          title="Base de datos y respaldo"
          description="Supervisa el estado del sistema y administra restauraciones."
        >
          <BackupStatusCard
            lastBackup={formatBackupDate(settings.lastBackup)}
            statusText={getRelativeBackupText(settings.lastBackup)}
            onCreateBackup={handleCreateBackup}
            onRestoreBackup={handleRestoreBackup}
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Bell}
          iconBg="bg-[#FFFBEA]"
          iconColor="text-[#FFB703]"
          title="Resumen del sistema"
          description="Indicadores rápidos del estado general de la plataforma."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[#EAEAEA] bg-[#F8F9FA]">
              <p className="text-[12px] text-[#8A8A8A]">Estado general</p>
              <p className="text-[18px] font-bold text-[#1A1A1A] mt-1 capitalize">
                {settings.systemStatus}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#EAEAEA] bg-[#F8F9FA]">
              <p className="text-[12px] text-[#8A8A8A]">Último backup</p>
              <p className="text-[18px] font-bold text-[#1A1A1A] mt-1">
                {getRelativeBackupText(settings.lastBackup)}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#EAEAEA] bg-[#F8F9FA]">
              <p className="text-[12px] text-[#8A8A8A]">Política de acceso</p>
              <p className="text-[18px] font-bold text-[#1A1A1A] mt-1">Por roles</p>
            </div>

            <div className="p-4 rounded-lg border border-[#EAEAEA] bg-[#F8F9FA]">
              <p className="text-[12px] text-[#8A8A8A]">Configuración cargada</p>
              <p className="text-[18px] font-bold text-[#1A1A1A] mt-1">Correctamente</p>
            </div>
          </div>
        </SettingsSectionCard>
      </div>

      <DangerZone onReset={handleResetSettings} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-xl p-6 border border-[#EAEAEA] shadow-sm">
        <div>
          <p className="text-[14px] font-semibold text-[#1A1A1A]">Estado de edición</p>
          <p className="text-[12px] text-[#8A8A8A] mt-1">
            {hasChanges ? 'Tienes cambios pendientes por guardar.' : 'No hay cambios pendientes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-3 bg-[#F5F5F5] text-[#4A4A4A] rounded-lg text-[14px] font-medium hover:bg-[#EAEAEA] transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#FF2D55] text-white rounded-lg text-[14px] font-medium hover:bg-[#E02849] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
