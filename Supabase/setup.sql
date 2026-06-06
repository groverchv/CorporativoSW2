-- =========================================================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS PARA SUPABASE
-- Proyecto: Plan Risk 3D (Solo Autenticación y Perfiles de Usuario)
-- =========================================================================

-- Deshabilitar temporalmente los triggers de eventos (si aplica)
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- =========================================================================
-- 1. LIMPIEZA DE TABLAS Y OBJETOS EXISTENTES
-- =========================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS public.presentacion CASCADE;
DROP TABLE IF EXISTS public.contenido CASCADE;
DROP TABLE IF EXISTS public.sub_menu CASCADE;
DROP TABLE IF EXISTS public.menu CASCADE;
DROP TABLE IF EXISTS public.rol_usuario CASCADE;
DROP TABLE IF EXISTS public.rol CASCADE;
DROP TABLE IF EXISTS public.usuario CASCADE;

-- =========================================================================
-- 2. CREACIÓN DE TABLAS BASE
-- =========================================================================

-- Tabla: usuario (Vinculada a auth.users de Supabase)
CREATE TABLE public.usuario (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nombre text,
    apellido text,
    correo text UNIQUE NOT NULL,
    celular text,
    organizacion text,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 3. TRIGGERS PARA CONTROL DE FECHAS (updated_at)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuario_updated_at BEFORE UPDATE ON public.usuario FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 4. TRIGGERS PARA SINCRONIZACIÓN AUTOMÁTICA DE REGISTRO
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Sincronizar con la tabla pública de usuarios
    INSERT INTO public.usuario (id, nombre, apellido, correo, celular, organizacion, estado)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
        COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'celular', ''),
        COALESCE(NEW.raw_user_meta_data->>'organizacion', ''),
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 5. HABILITACIÓN DE SEGURIDAD DE FILA (RLS)
-- =========================================================================
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 6. POLÍTICAS DE RLS (Row Level Security)
-- =========================================================================

-- Permitir lectura a usuarios autenticados para ver perfiles
CREATE POLICY "Permitir lectura de perfiles a usuarios autenticados" ON public.usuario
    FOR SELECT TO authenticated USING (true);

-- Permitir lectura de su propio perfil a cualquier usuario (por seguridad de fallback)
CREATE POLICY "Permitir lectura de perfil propio" ON public.usuario
    FOR SELECT USING (auth.uid() = id);

-- Permitir actualización de perfil propio
CREATE POLICY "Permitir actualización de perfil propio" ON public.usuario
    FOR UPDATE USING (auth.uid() = id);
