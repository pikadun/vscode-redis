export interface RedisInfo {
    Server: InfoServer,
    Clients: InfoClients,
    Memory: InfoMemory,
    Persistence: InfoPersistence,
    Stats: InfoStats,
    Replication: InfoReplication,
    CPU: InfoCPU,
    Cluster: InfoCluster,
    Keyspace: InfoKeyspace
}

export interface InfoServer {
    redis_version: string,
    redis_git_sha1: string,
    redis_git_dirty: string,
    redis_build_id: string,
    redis_mode: string,
    os: string,
    arch_bits: string,
    multiplexing_api: string,
    atomicvar_api: string,
    gcc_version: string,
    process_id: string,
    run_id: string,
    tcp_port: string,
    uptime_in_seconds: string,
    uptime_in_days: string,
    hz: string,
    lru_clock: string,
    executable: string,
    config_file: string
}

export interface InfoClients {
    connected_clients: string,
    client_longest_output_list: string,
    client_biggest_input_buf: string,
    blocked_clients: string
}

export interface InfoMemory {
    used_memory: string,
    used_memory_human: string,
    used_memory_rss: string,
    used_memory_rss_human: string,
    used_memory_peak: string,
    used_memory_peak_human: string,
    used_memory_peak_perc: string,
    used_memory_overhead: string,
    used_memory_startup: string,
    used_memory_dataset: string,
    used_memory_dataset_perc: string,
    total_system_memory: string,
    total_system_memory_human: string,
    used_memory_lua: string,
    used_memory_lua_human: string,
    maxmemory: string,
    maxmemory_human: string,
    maxmemory_policy: string,
    mem_fragmentation_ratio: string,
    mem_allocator: string,
    active_defrag_running: string,
    lazyfree_pending_objects: string
}

export interface InfoPersistence {
    loading: string,
    rdb_changes_since_last_save: string,
    rdb_bgsave_in_progress: string,
    rdb_last_save_time: string,
    rdb_last_bgsave_status: string,
    rdb_last_bgsave_time_sec: string,
    rdb_current_bgsave_time_sec: string,
    rdb_last_cow_size: string,
    aof_enabled: string,
    aof_rewrite_in_progress: string,
    aof_rewrite_scheduled: string,
    aof_last_rewrite_time_sec: string,
    aof_current_rewrite_time_sec: string,
    aof_last_bgrewrite_status: string,
    aof_last_write_status: string,
    aof_last_cow_size: string
}



export interface InfoStats {
    total_connections_received: string,
    total_commands_processed: string,
    instantaneous_ops_per_sec: string,
    total_net_input_bytes: string,
    total_net_output_bytes: string,
    instantaneous_input_kbps: string,
    instantaneous_output_kbps: string,
    rejected_connections: string,
    sync_full: string,
    sync_partial_ok: string,
    sync_partial_err: string,
    expired_keys: string,
    expired_stale_perc: string,
    expired_time_cap_reached_count: string,
    evicted_keys: string,
    keyspace_hits: string,
    keyspace_misses: string,
    pubsub_channels: string,
    pubsub_patterns: string,
    latest_fork_usec: string,
    migrate_cached_sockets: string,
    slave_expires_tracked_keys: string,
    active_defrag_hits: string,
    active_defrag_misses: string,
    active_defrag_key_hits: string,
    active_defrag_key_misses: string
}

export interface InfoReplication {
    role: string,
    connected_slaves: string,
    master_replid: string,
    master_replid2: string,
    master_repl_offset: string,
    second_repl_offset: string,
    repl_backlog_active: string,
    repl_backlog_size: string,
    repl_backlog_first_byte_offset: string,
    repl_backlog_histlen: string
}

export interface InfoCPU {
    used_cpu_sys: string,
    used_cpu_user: string,
    used_cpu_sys_children: string,
    used_cpu_user_children: string
}

export interface InfoCluster {
    cluster_enabled: string
}

export interface InfoKeyspace {
    [x: string]: {
        keys: number,
        expires: number,
        avg_ttl: number
    }
}