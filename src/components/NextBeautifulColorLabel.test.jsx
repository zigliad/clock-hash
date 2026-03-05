import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextBeautifulColorLabel } from './NextBeautifulColorLabel'

describe('NextBeautifulColorLabel', () => {
  it('renders label and countdown when data present', () => {
    render(
      <NextBeautifulColorLabel
        label="coral"
        display="4m 12s"
        textColor="#000"
      />
    )
    expect(screen.getByText(/coral/)).toBeInTheDocument()
    expect(screen.getByText(/4m 12s/)).toBeInTheDocument()
  })

  it('renders nothing when label is null', () => {
    const { container } = render(
      <NextBeautifulColorLabel
        label={null}
        display={null}
        textColor="#000"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when display is null', () => {
    const { container } = render(
      <NextBeautifulColorLabel
        label="coral"
        display={null}
        textColor="#000"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('applies text color from prop', () => {
    render(
      <NextBeautifulColorLabel
        label="high-saturation"
        display="2m 30s"
        textColor="#fff"
      />
    )
    const el = screen.getByTestId('next-beautiful-label')
    expect(el.style.color).toBeTruthy()
  })

  it('has data-testid for querying', () => {
    render(
      <NextBeautifulColorLabel
        label="red"
        display="1m 5s"
        textColor="#000"
      />
    )
    expect(screen.getByTestId('next-beautiful-label')).toBeInTheDocument()
  })
})
