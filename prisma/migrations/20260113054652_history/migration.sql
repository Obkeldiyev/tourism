-- CreateTable
CREATE TABLE "Booking_history" (
    "id" TEXT NOT NULL,
    "tur_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "seats_booked" INTEGER NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_history_pkey" PRIMARY KEY ("id")
);
