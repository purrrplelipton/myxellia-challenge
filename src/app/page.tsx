'use client'

import React, { useId } from 'react'
import CarouselCard from '~/components/CarouselCard'

export default function Home() {
  const id = useId()

  return (
    <React.Fragment>
      <p className="text-xl font-semibold">
        Welcome, <span>Emmanuel</span>
      </p>
      <section className="mt-4 mb-5"></section>
      <section className="flex gap-4">
        {carousels.map((carousel, index) => (
          <CarouselCard
            key={`${id}-${index}`}
            {...carousel}
            className="aspect-[418/286] w-full max-w-105 overflow-clip rounded-xl"
          />
        ))}
      </section>
    </React.Fragment>
  )
}

const carousels = [
  {
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1661064941810-7a62f443fdb1',
        imageAlt: 'A serene lake',
        title: 'Tranquil Lake',
        description: 'Relax by the still waters surrounded by mountains.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1633130664306-2e6acb58d308',
        imageAlt: 'A bustling city skyline',
        title: 'City Nights',
        description: 'Discover the vibrant nightlife of the metropolis.',
      },
    ],
  },
  {
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1586657263857-346c4b712ff5',
        imageAlt: 'Delicious pastry close-up',
        title: 'Fresh Pastries',
        description: 'Warm, flaky croissants straight from the oven.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1633104060731-32143505bacc',
        imageAlt: 'Healthy smoothie bowl',
        title: 'Smoothie Bowl',
        description: 'Bright, fruity, and packed with goodness.',
      },
    ],
  },
]
