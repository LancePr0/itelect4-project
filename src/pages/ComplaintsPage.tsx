// src/pages/ComplaintsPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import type { Complaint } from "../api/client";
import { fetchComplaints, createComplaint } from "../api/client";
import { complaintSchema } from "../schemas/complaintSchema";
import type { ComplaintFormValues } from "../schemas/complaintSchema";
import ComplaintCard from "../components/ComplaintCard";
import usePrevious from "../hooks/usePrevious";
import useToggle from "../hooks/useToggle";
import useUiStore from "../store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ComplaintsPage() {
  const queryClient = useQueryClient();

  // 1. READ
  const { data, isPending, isError, error } = useQuery<Complaint[]>({
    queryKey: ["complaints"],
    queryFn: fetchComplaints,
  });

  // The search box reads and writes the store, not local state
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);
  const [showDetails, toggleDetails] = useToggle(false);

  // The new-complaint form -- useForm holds the values, runs the schema,
  // and stores the errors. No useState per field any more.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    mode: "onBlur",
    defaultValues: {
      complainantName: "",
      violationType: "",
      tricycleBodyNumber: "",
    },
  });

  // 2. WRITE -- mutationFn does the POST, onSuccess cleans up after it
  const addComplaint = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      // "the complaints list is out of date now -- go and refetch it"
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      reset();
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: ComplaintFormValues): void => {
    addComplaint.mutate({
      complaint_number: `CMP-${Date.now()}`,
      complainant_name: values.complainantName,
      tricycle_body_number: values.tricycleBodyNumber,
      violation_type: values.violationType,
      status: "Pending",
      created_at: new Date().toISOString(),
    });
  };

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400">
        Loading complaints...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  const filteredComplaints = data.filter(
    (c) =>
      c.violation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complaints
        </h2>
        <button
          onClick={toggleDetails}
          className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {showDetails ? "Hide Extra Details" : "Show Extra Details"}
        </button>
      </div>

      {/* File a new complaint -- POST /complaints, then invalidate the list */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 sm:grid-cols-3"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="complainantName" className="text-foreground">
            Complainant name
          </Label>
          <Input
            id="complainantName"
            {...register("complainantName")}
            aria-invalid={errors.complainantName ? true : undefined}
            placeholder="Maria Santos"
          />
          {errors.complainantName && (
            <p className="text-sm text-red-600">
              {errors.complainantName.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="violationType" className="text-foreground">
            Violation
          </Label>
          <Input
            id="violationType"
            {...register("violationType")}
            aria-invalid={errors.violationType ? true : undefined}
            placeholder="Overcharging"
          />
          {errors.violationType && (
            <p className="text-sm text-red-600">
              {errors.violationType.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="tricycleBodyNumber" className="text-foreground">
            Tricycle body #
          </Label>
          <div className="flex gap-2">
            <Input
              id="tricycleBodyNumber"
              {...register("tricycleBodyNumber")}
              aria-invalid={errors.tricycleBodyNumber ? true : undefined}
              placeholder="123"
            />
            {/* Never disabled on "invalid": clicking it is what shows the
                error messages. Only a save in flight disables it. */}
            <Button type="submit" disabled={addComplaint.isPending}>
              {addComplaint.isPending ? "Filing..." : "File"}
            </Button>
          </div>
          {errors.tricycleBodyNumber && (
            <p className="text-sm text-red-600">
              {errors.tricycleBodyNumber.message}
            </p>
          )}
        </div>
      </form>

      {addComplaint.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addComplaint.error.message}
        </p>
      )}

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search complaints..."
      />

      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
          Previous search: "{previousSearch}"
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredComplaints.length === 0 ? (
          <p className="col-span-full text-gray-500 dark:text-gray-400">
            No complaints found.
          </p>
        ) : (
          filteredComplaints.map((item) => (
            <Link key={item.id} to={`/complaints/${item.id}`}>
              <ComplaintCard
                complaint={item}
                variant={showDetails ? "default" : "compact"}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ComplaintsPage;
