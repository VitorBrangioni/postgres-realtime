
-- adds information necessary to support logical decoding.
-- Each level includes the information logged at all lower levels.
ALTER SYSTEM SET wal_level='logical'; 

-- Specifies the maximum number of concurrent connections from standby servers or streaming base backup clients
-- (i.e., the maximum number of simultaneously running WAL sender processes). 
-- 10 already is the default value
-- RECOMMENDATIONS: If you are replicating, you want to set this to the maximum number of standby servers you mighy possibly have
-- Performance impact when set above zero, but no additional penalty for setting it higher.s
ALTER SYSTEM SET max_wal_senders='10'; 

-- Specifies the maximum number of replication slots (see streaming-replication-slots) that the server can support
-- 10 already is the default value
ALTER SYSTEM SET max_replication_slots='10';


-- Tables for testing

CREATE TABLE public.status (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(255)
);
INSERT INTO 
    public.status (name) 
VALUES 
    ('PENDDING'),
    ('IN_PROGRESS'),
    ('CONCLUDED');

CREATE TABLE public.service (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status_id bigint REFERENCES public.status NOT NULL
);

INSERT INTO 
    public.service (name, status_id)
VALUES 
    ('Reboque', 1),
    ('Bateria', 3),
    ('Pane Seca', 1),
    ('Troca de Luz', 2);


-- Create the Replication publication 
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
-- Send the previus values
ALTER TABLE public.service REPLICA IDENTITY FULL;
ALTER TABLE public.status REPLICA IDENTITY FULL;