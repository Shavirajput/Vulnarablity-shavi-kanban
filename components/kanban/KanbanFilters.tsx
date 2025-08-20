'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RootState, AppDispatch } from '@/lib/store'
import { setSearchTerm, setSelectedLabels, setSortBy } from '@/lib/features/kanban/kanbanSlice'
import { Search, Filter, SortAsc, SortDesc, LayoutGrid, List, X } from 'lucide-react'

export default function KanbanFilters() {
  const dispatch = useDispatch<AppDispatch>()
  const { searchTerm, selectedLabels, sortBy, sortOrder, labels } = useSelector((state: RootState) => state.kanban)
  const [viewType, setViewType] = useState<'board' | 'list'>('board')

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handleLabelToggle = (labelId: string) => {
    const newSelectedLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId]
    dispatch(setSelectedLabels(newSelectedLabels))
  }

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc'
    dispatch(setSortBy({ sortBy: newSortBy as any, sortOrder: newSortOrder }))
  }

  const clearFilters = () => {
    dispatch(setSearchTerm(''))
    dispatch(setSelectedLabels([]))
  }

  const selectedLabelsData = labels.filter(label => selectedLabels.includes(label.id))

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by issue name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
          const [newSortBy, newSortOrder] = value.split('-')
          dispatch(setSortBy({ sortBy: newSortBy as any, sortOrder: newSortOrder as any }))
        }}>
          <SelectTrigger className="w-40 bg-white/50 border-gray-300">
            {sortOrder === 'desc' ? (
              <SortDesc className="w-4 h-4 mr-2" />
            ) : (
              <SortAsc className="w-4 h-4 mr-2" />
            )}
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="severity-desc">High Severity</SelectItem>
            <SelectItem value="severity-asc">Low Severity</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* Filters */}
        <div className="flex gap-2">
          {/* Labels Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/50 border-gray-300 hover:bg-white">
                <Filter className="w-4 h-4 mr-2" />
                Labels
                {selectedLabels.length > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs bg-blue-100 text-blue-700">
                    {selectedLabels.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by Labels</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {labels.map(label => (
                    <label
                      key={label.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label.id)}
                        onChange={() => handleLabelToggle(label.id)}
                        className="rounded border-gray-300"
                      />
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: label.color + '20',
                          borderColor: label.color,
                          color: label.color,
                        }}
                      >
                        {label.name}
                      </Badge>
                      <span className="text-sm capitalize text-gray-500">
                        ({label.type})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* View Toggle */}
          <div className="flex border border-gray-200 rounded-md">
            <Button
              variant={viewType === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('board')}
              className={`rounded-r-none border-r ${viewType === 'board' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-white/50'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('list')}
              className={`rounded-l-none ${viewType === 'list' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-white/50'}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedLabels.length > 0) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">Filters:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700">
              Search: "{searchTerm}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}
          
          {selectedLabelsData.map(label => (
            <Badge 
              key={label.id}
              variant="secondary" 
              className="gap-1"
              style={{
                backgroundColor: label.color + '20',
                borderColor: label.color,
                color: label.color,
              }}
            >
              {label.name}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleLabelToggle(label.id)}
              />
            </Badge>
          ))}
          
          {(searchTerm || selectedLabels.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}