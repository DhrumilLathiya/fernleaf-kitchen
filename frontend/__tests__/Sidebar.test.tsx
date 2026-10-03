import { render, screen } from '@testing-library/react'
import Sidebar from '@/components/Sidebar'

describe('Sidebar', () => {
  it('renders the navigation links based on ezCater reference', () => {
    render(<Sidebar />)
    
    // Check if the logo / brand name is there
    expect(screen.getByText('Fernleaf Kitchen')).toBeInTheDocument()

    // Check for the main navigation links
    expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /orders/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kitchen/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dispatch/i })).toBeInTheDocument()
  })
})
