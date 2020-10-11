import { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchFilterList, filterSelector } from '@/modules/filter';
import { JsonAPIError } from '@/entities/JsonAPIError';
import Link from 'next/link'

export const FilterList: FC = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();

  const dispatch = useAppDispatch();
  const filters = useAppSelector(filterSelector.selectAll);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors } = await dispatch(fetchFilterList({ per: 100 }));
      if (cleanuped) return;
      setLoading(false);
      if (errors) setErrors(errors);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, []);

  const Content = (() => {
    if (loading) {
      return (
        <p>loading...</p>
      );
    }
    if (errors) {
      return (
        <div>
          {errors.map((e, i) => (
            <p key={i}>{e.title}</p>
          ))}
        </div>
      );
    }
    return (
      <ul>
        {filters.map((filter) => (
          <li key={filter.id}>
            <Link href={`/?filter_id=${filter.id}`}>{filter.attributes.name}</Link >
          </li>
        ))}
      </ul>
    );
  })();

  return (
    <div>
      <p>Filters</p>
      {Content}
    </div>
  );
};
