import { Card, Skeleton } from '@rh-ponto/ui';

export { AnalyticsSkeleton } from './page-skeletons/analytics-skeleton';
export { DashboardSkeleton } from './page-skeletons/dashboard-skeleton';
export { EmployeeDetailSkeleton } from './page-skeletons/employee-detail-skeleton';
export { EmployeesListSkeleton } from './page-skeletons/employees-list-skeleton';
export { FormPageSkeleton } from './page-skeletons/form-page-skeleton';
export { ListPageSkeleton } from './page-skeletons/list-page-skeleton';
export { TimeRecordsSkeleton } from './page-skeletons/time-records-skeleton';

export const OverviewPageSkeleton = () => (
  <div className="space-y-8 sm:space-y-10">
    <div className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-12 w-80 max-w-full" />
      <Skeleton className="h-5 w-[32rem] max-w-full" />
    </div>

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-full" />
          </div>
        </Card>
      ))}
    </section>

    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6 sm:p-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-[18rem] w-full rounded-[1.5rem]" />
        </div>
      </Card>
      <div className="grid gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="p-6 sm:p-7">
            <div className="space-y-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-56 max-w-full" />
              <Skeleton className="h-24 w-full rounded-[1.5rem]" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export const TablePageSkeleton = () => (
  <div className="space-y-8 sm:space-y-10">
    <div className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-12 w-72 max-w-full" />
      <Skeleton className="h-5 w-[30rem] max-w-full" />
    </div>

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </Card>
      ))}
    </section>

    <Card className="p-5 sm:p-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full xl:w-32" />
      </div>
    </Card>

    <Card className="overflow-hidden">
      <div className="space-y-4 px-5 py-5 sm:px-8 sm:py-6">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="space-y-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] px-5 py-5 sm:grid-cols-4 sm:px-8"
          >
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-9 w-28 sm:justify-self-end" />
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export const DetailPageSkeleton = () => (
  <div className="space-y-8 sm:space-y-10">
    <div className="space-y-3">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-12 w-96 max-w-full" />
      <Skeleton className="h-5 w-[32rem] max-w-full" />
    </div>

    <section className="grid gap-8 xl:grid-cols-[0.42fr_0.58fr]">
      <Card className="p-6 sm:p-8">
        <div className="space-y-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-36 w-full rounded-[1.5rem]" />
        </div>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  </div>
);
