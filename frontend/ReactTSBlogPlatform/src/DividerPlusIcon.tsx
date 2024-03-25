import { PlusIcon } from '@heroicons/react/20/solid'

export default function DividerPlusIcon() {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-orange-400" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-2 text-gray-500">
          <PlusIcon className="h-5 w-5 text-orange-600" aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}
