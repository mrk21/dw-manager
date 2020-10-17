import { FC } from 'react';
import Link from 'next/link'
import { Indicator } from './Indicator';
import { Errors } from './Errors';
import { useAllFilterList } from '@/modules/filter/useAllFilterList';

export const FilterList: FC = () => {
  const [loading, errors, filters] = useAllFilterList();

  return (
    <div>
      <p>Filters</p>
      {(() => {
        if (loading) return <Indicator />;
        if (errors) return <Errors errors={errors} />;
        return (
          <ul>
            {filters.map((filter) => (
              <li key={filter.id}>
                <Link href={`/?filter_id=${filter.id}`}>{filter.attributes.name}</Link >
              </li>
            ))}
          </ul>
        );
      })()}
    </div>
  );
};
