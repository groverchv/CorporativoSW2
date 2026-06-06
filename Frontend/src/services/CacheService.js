// src/services/CacheService.js
// Servicio de caché para evitar peticiones repetidas

class CacheService {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
        // Tiempo de expiración por defecto: 5 minutos
        this.defaultTTL = 5 * 60 * 1000;
    }

    /**
     * Genera una clave única para la caché
     */
    generateKey(prefix, id) {
        return `${prefix}_${id}`;
    }

    /**
     * Obtiene un valor de la caché si existe y no ha expirado
     */
    get(key) {
        if (!this.cache.has(key)) {
            return null;
        }

        const timestamp = this.timestamps.get(key);
        const now = Date.now();

        // Verificar si ha expirado
        if (now - timestamp > this.defaultTTL) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            return null;
        }

        return this.cache.get(key);
    }

    /**
     * Guarda un valor en la caché
     */
    set(key, value) {
        this.cache.set(key, value);
        this.timestamps.set(key, Date.now());
    }

    /**
     * Invalida una entrada específica
     */
    invalidate(key) {
        this.cache.delete(key);
        this.timestamps.delete(key);
    }

    /**
     * Invalida todas las entradas que empiezan con un prefijo
     */
    invalidateByPrefix(prefix) {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
                this.timestamps.delete(key);
            }
        }
    }

    /**
     * Limpia toda la caché
     */
    clear() {
        this.cache.clear();
        this.timestamps.clear();
    }

    /**
     * Obtiene o carga datos (con caché)
     */
    async getOrFetch(key, fetchFunction) {
        const cached = this.get(key);
        if (cached !== null) {
            console.log(`📦 Cache hit: ${key}`);
            return cached;
        }

        console.log(`🔄 Fetching: ${key}`);
        const data = await fetchFunction();
        this.set(key, data);
        return data;
    }
}

// Singleton
const cacheService = new CacheService();
export default cacheService;
