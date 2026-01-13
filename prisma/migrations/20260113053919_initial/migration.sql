-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "breakfast" BOOLEAN NOT NULL,
    "lunch" BOOLEAN NOT NULL,
    "dinner" BOOLEAN NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "transport" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "messanger_id" TEXT NOT NULL,
    "max_seats" INTEGER NOT NULL,

    CONSTRAINT "Turs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "tur_id" TEXT NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "id" TEXT NOT NULL,
    "tur_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "seats_booked" INTEGER NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_info" (
    "id" SERIAL NOT NULL,
    "info_title" TEXT NOT NULL,
    "info_description" TEXT NOT NULL,
    "tur_id" TEXT NOT NULL,

    CONSTRAINT "additional_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_tur_id_fkey" FOREIGN KEY ("tur_id") REFERENCES "Turs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_tur_id_fkey" FOREIGN KEY ("tur_id") REFERENCES "Turs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_info" ADD CONSTRAINT "additional_info_tur_id_fkey" FOREIGN KEY ("tur_id") REFERENCES "Turs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
