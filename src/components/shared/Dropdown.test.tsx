import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Dropdown, { type DropdownOption } from './Dropdown';

const options: DropdownOption[] = [
  { label: 'Nairobi', value: 'nairobi' },
  { label: 'Mombasa', value: 'mombasa' },
  { label: 'Kisumu', value: 'kisumu' },
];

interface TestDropdownProps {
  initialValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (newValue: string | string[]) => void;
}

// Simulates a parent controlling the Dropdown value.
function TestDropdown({
  initialValue = '',
  multiple = false,
  disabled = false,
  error,
  onChange,
}: TestDropdownProps) {
  const [value, setValue] = useState<string | string[]>(initialValue);

  const handleChange = (newValue: string | string[]) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Dropdown
      id="location"
      label="Location"
      options={options}
      value={value}
      onChange={handleChange}
      multiple={multiple}
      disabled={disabled}
      error={error}
    />
  );
}

describe('Dropdown', () => {
  describe('Rendering', () => {
    it('renders the label and placeholder', () => {
      render(<TestDropdown />);

      expect(screen.getByText('Location')).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText('Select an option')
      ).toBeInTheDocument();
    });

    it('displays the selected value', () => {
      render(<TestDropdown initialValue="nairobi" />);

      expect(screen.getByRole('combobox')).toHaveValue('Nairobi');
    });

    it('displays the supplied error message', () => {
      render(<TestDropdown error="Location is required" />);

      expect(screen.getByText('Location is required')).toBeInTheDocument();

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('renders selected values as tags in multiple mode', () => {
      render(<TestDropdown multiple initialValue={['nairobi', 'mombasa']} />);

      expect(screen.getByText('Nairobi')).toBeInTheDocument();
      expect(screen.getByText('Mombasa')).toBeInTheDocument();
    });
  });

  describe('Single selection', () => {
    it('opens the dropdown when the input receives focus', async () => {
      const user = userEvent.setup();

      render(<TestDropdown />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('displays available options when opened', async () => {
      const user = userEvent.setup();

      render(<TestDropdown />);

      await user.click(screen.getByRole('combobox'));

      const listbox = screen.getByRole('listbox');

      expect(
        within(listbox).getByRole('option', { name: 'Nairobi' })
      ).toBeInTheDocument();

      expect(
        within(listbox).getByRole('option', { name: 'Mombasa' })
      ).toBeInTheDocument();
    });

    it('updates the selected value when an option is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<TestDropdown onChange={handleChange} />);

      await user.click(screen.getByRole('combobox'));

      await user.click(screen.getByRole('option', { name: 'Nairobi' }));

      expect(handleChange).toHaveBeenCalledWith('nairobi');

      expect(screen.getByRole('combobox')).toHaveValue('Nairobi');
    });

    it('closes the dropdown after selecting an option', async () => {
      const user = userEvent.setup();

      render(<TestDropdown />);

      await user.click(screen.getByRole('combobox'));

      await user.click(screen.getByRole('option', { name: 'Mombasa' }));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Multiple selection', () => {
    it('allows selecting multiple options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<TestDropdown multiple onChange={handleChange} />);

      await user.click(screen.getByRole('combobox'));

      await user.click(screen.getByRole('option', { name: 'Nairobi' }));

      expect(handleChange).toHaveBeenLastCalledWith(['nairobi']);

      await user.click(screen.getByRole('combobox'));

      await user.click(screen.getByRole('option', { name: 'Mombasa' }));

      expect(handleChange).toHaveBeenLastCalledWith(['nairobi', 'mombasa']);

      //   expect(screen.getByText('Nairobi')).toBeInTheDocument();
      //   expect(screen.getByText('Mombasa')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove Nairobi' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Remove Mombasa' })
      ).toBeInTheDocument();
    });

    it('allows deselecting an already selected option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <TestDropdown
          multiple
          initialValue={['nairobi']}
          onChange={handleChange}
        />
      );

      await user.click(screen.getByRole('combobox'));

      await user.click(screen.getByRole('option', { name: 'Nairobi' }));

      expect(handleChange).toHaveBeenCalledWith([]);
    });

    it('removes a selected value when its remove button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <TestDropdown
          multiple
          initialValue={['nairobi', 'mombasa']}
          onChange={handleChange}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Remove Nairobi' }));

      expect(handleChange).toHaveBeenCalledWith(['mombasa']);

      expect(screen.queryByText('Nairobi')).not.toBeInTheDocument();
      expect(screen.getByText('Mombasa')).toBeInTheDocument();
    });

    it('removes the last selected value when Backspace is pressed', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <TestDropdown
          multiple
          initialValue={['nairobi', 'mombasa']}
          onChange={handleChange}
        />
      );

      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.keyboard('{Backspace}');

      expect(handleChange).toHaveBeenCalledWith(['nairobi']);
    });
  });

  describe('Search', () => {
    it('filters options based on the search input', async () => {
      const user = userEvent.setup();

      render(<TestDropdown />);

      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.type(input, 'nai');

      expect(
        screen.getByRole('option', { name: 'Nairobi' })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('option', { name: 'Mombasa' })
      ).not.toBeInTheDocument();
    });

    it('displays a message when no matching options exist', async () => {
      const user = userEvent.setup();

      render(<TestDropdown />);

      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.type(input, 'xyz');

      expect(screen.getByText('No options found.')).toBeInTheDocument();
    });
  });

  describe('Keyboard interactions', () => {
    it('closes the dropdown when Escape is pressed', async () => {
      const user = userEvent.setup();

      render(<TestDropdown />);

      const input = screen.getByRole('combobox');

      await user.click(input);

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects the highlighted option when Enter is pressed', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<TestDropdown onChange={handleChange} />);

      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.keyboard('{ArrowDown}{Enter}');

      expect(handleChange).toHaveBeenCalledWith('mombasa');
    });
  });

  describe('Disabled state', () => {
    it('disables the input and toggle button', () => {
      render(<TestDropdown disabled />);

      expect(screen.getByRole('combobox')).toBeDisabled();

      expect(
        screen.getByRole('button', { name: 'Toggle dropdown' })
      ).toBeDisabled();
    });

    it('does not open the dropdown when disabled', async () => {
      const user = userEvent.setup();

      render(<TestDropdown disabled />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Outside interactions', () => {
    it('closes the dropdown when clicking outside', async () => {
      const user = userEvent.setup();

      render(
        <>
          <TestDropdown />
          <button type="button">Outside</button>
        </>
      );

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
