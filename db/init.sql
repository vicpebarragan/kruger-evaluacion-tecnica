--DDL
CREATE SEQUENCE users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE project_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE task_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    created_by character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default",
    updated_by character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['USER'::character varying, 'ADMIN'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to ktestfull;


CREATE TABLE IF NOT EXISTS public.project
(
    created_at timestamp(6) without time zone,
    id bigint NOT NULL DEFAULT nextval('project_id_seq'::regclass),
    owner_id bigint,
    created_by character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT project_pkey PRIMARY KEY (id),
    CONSTRAINT fk_owner FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project
    OWNER to ktestfull;


CREATE TABLE IF NOT EXISTS public.task
(
    due_date date,
    assigned_to_id bigint,
    created_at timestamp(6) without time zone,
    id bigint NOT NULL DEFAULT nextval('task_id_seq'::regclass),
    project_id bigint,
    created_by character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default",
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT task_pkey PRIMARY KEY (id),
    CONSTRAINT fk_assigned_to FOREIGN KEY (assigned_to_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_project FOREIGN KEY (project_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT task_status_check CHECK (status::text = ANY (ARRAY['PENDING'::character varying, 'IN_PROGRESS'::character varying, 'DONE'::character varying]::text[]))
)	

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.task
    OWNER to ktestfull;	

--DML

INSERT INTO public.users (
    created_by,
    email,
    password,
    role,
    updated_by,
    username
) VALUES (
    'ADMINISTRATOR',
    'kruger@test.com',
    '$2a$10$GsgPYsyflPPOyG0M.vLepuR/wyr3LqWnvROj4KdtPk84522NnqxRO',
    'ADMIN',
    '',
    'kruger'
);
	