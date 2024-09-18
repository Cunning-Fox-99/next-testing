'use client'

const posts = [
  {
    id: 1,
    title: 'Boost your conversion rate',
    href: '#',
    description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    category: { title: 'Marketing', href: '#' },
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  // More posts...
]

export default function HomePage() {


  return (
      <>
          <div className="bg-white">

              <div className="relative isolate px-6 pt-14 lg:px-8">
                  <div
                      aria-hidden="true"
                      className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                  >
                      <div
                          style={{
                              clipPath:
                                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                          }}
                          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                      />
                  </div>
                  <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                          <div
                              className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                              Announcing our next round of funding.{' '}
                              <a href="#" className="font-semibold text-indigo-600">
                                  <span aria-hidden="true" className="absolute inset-0"/>
                                  Read more <span aria-hidden="true">&rarr;</span>
                              </a>
                          </div>
                      </div>
                      <div className="text-center">
                          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                              Data to enrich your online business
                          </h1>
                          <p className="mt-6 text-lg leading-8 text-gray-600">
                              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                              Elit sunt amet
                              fugiat veniam occaecat fugiat aliqua.
                          </p>
                          <div className="mt-10 flex items-center justify-center gap-x-6">
                              <a
                                  href="#"
                                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                  Get started
                              </a>
                              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                                  Learn more <span aria-hidden="true">→</span>
                              </a>
                          </div>
                      </div>
                  </div>
                  <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                  >
                      <div
                          style={{
                              clipPath:
                                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                          }}
                          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                      />
                  </div>
              </div>
          </div>
          <div className="bg-white py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl lg:mx-0">
                      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
                      <p className="mt-2 text-lg leading-8 text-gray-600">
                          Learn how to grow your business with our expert advice.
                      </p>
                  </div>
                  <div
                      className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                      {posts.map((post) => (
                          <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                              <div className="flex items-center gap-x-4 text-xs">
                                  <time dateTime={post.datetime} className="text-gray-500">
                                      {post.date}
                                  </time>
                                  <a
                                      href={post.category.href}
                                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                  >
                                      {post.category.title}
                                  </a>
                              </div>
                              <div className="group relative">
                                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                      <a href={post.href}>
                                          <span className="absolute inset-0"/>
                                          {post.title}
                                      </a>
                                  </h3>
                                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                              </div>
                              <div className="relative mt-8 flex items-center gap-x-4">
                                  <img alt="" src={post.author.imageUrl} className="h-10 w-10 rounded-full bg-gray-50"/>
                                  <div className="text-sm leading-6">
                                      <p className="font-semibold text-gray-900">
                                          <a href={post.author.href}>
                                              <span className="absolute inset-0"/>
                                              {post.author.name}
                                          </a>
                                      </p>
                                      <p className="text-gray-600">{post.author.role}</p>
                                  </div>
                              </div>
                          </article>
                      ))}
                  </div>
              </div>
          </div>
      </>
  )
}
