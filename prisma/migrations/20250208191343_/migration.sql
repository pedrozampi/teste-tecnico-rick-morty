-- AlterTable
CREATE SEQUENCE characters_id_seq;
ALTER TABLE "characters" ALTER COLUMN "id" SET DEFAULT nextval('characters_id_seq');
ALTER SEQUENCE characters_id_seq OWNED BY "characters"."id";
