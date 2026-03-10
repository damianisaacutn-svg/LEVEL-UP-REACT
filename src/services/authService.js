import { supabase } from '../config/supabaseClient'

/* ================================
   REGISTER USER
================================ */

export const registerUser = async data => {
  const { email, password, nombre, rol, instructorData } = data

  /* 1️⃣ Crear usuario en Supabase Auth */

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
        rol,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  const user = authData.user

  if (!user) {
    throw new Error('No se pudo crear el usuario')
  }

  /* 2️⃣ Obtener usuario creado por el trigger */

  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (usuarioError) {
    throw new Error(usuarioError.message)
  }

  if (!usuario) {
    throw new Error(
      'El usuario fue creado en Auth pero no se encontró en la tabla usuarios. Verifica el trigger handle_new_user.'
    )
  }

  const usuarioId = usuario.id

  /* 3️⃣ Crear perfil de usuario */

  const { error: perfilError } = await supabase.from('perfiles_usuario').insert({
    usuario_id: usuarioId,
  })

  if (perfilError) {
    throw new Error(perfilError.message)
  }

  /* 4️⃣ Si es instructor crear solicitud */

  if (rol === 'instructor') {
    const { error: instructorError } = await supabase.from('solicitudes_instructor').insert({
      usuario_id: usuarioId,
      experiencia: instructorData?.experiencia,
      portafolio_url: instructorData?.portafolio_url,
      github_url: instructorData?.github_url,
      linkedin_url: instructorData?.linkedin_url,
      certificaciones: instructorData?.certificaciones,
      estado: 'pendiente',
    })

    if (instructorError) {
      throw new Error(instructorError.message)
    }
  }

  return authData
}

/* ================================
   LOGIN
================================ */

export const loginUser = async (email, password) => {
  /* 1️⃣ login con Supabase Auth */

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  const userId = data.user.id

  /* 2️⃣ obtener estado y rol */

  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('estado, rol_id')
    .eq('auth_user_id', userId)
    .single()

  if (usuarioError) {
    throw new Error(usuarioError.message)
  }

  /* 3️⃣ validar estado */

  if (usuario.estado !== 'activo') {
    await supabase.auth.signOut()

    throw new Error('Tu cuenta está suspendida. Contacta al administrador.')
  }

  return {
    session: data.session,
    user: data.user,
    rol: usuario.rol_id,
  }
}

/* ================================
   LOGOUT
================================ */

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

/* ================================
   GET USER ROLE
================================ */

export const getUserRole = async authUserId => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('rol_id')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('No se encontró el rol del usuario')
  }

  return data.rol_id
}

/* ================================
   GET USER PROFILE
================================ */

export const getUserProfile = async authUserId => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(
      `
      id,
      nombre,
      estado,
      rol_id,
      created_at
    `
    )
    .eq('auth_user_id', authUserId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/* ================================
   GET CURRENT SESSION
================================ */

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return data.session
}

/* ================================
   GET CURRENT USER
================================ */

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}
