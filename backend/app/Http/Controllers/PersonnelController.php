<?php

namespace App\Http\Controllers;

use App\Http\Requests\PersonnelRequest;
use App\Http\Resources\PersonnelResource;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PersonnelController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $personnel = Personnel::query()
            ->when($request->string('search')->trim()->value(), function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('employee_id', "%{$search}%")
                        ->orWhereLike('name', "%{$search}%")
                        ->orWhereLike('team', "%{$search}%")
                        ->orWhereLike('position', "%{$search}%");
                });
            })
            ->when($request->filled('team'), fn ($query) => $query->where('team', $request->string('team')->value()))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->value()))
            ->orderBy('name')
            ->paginate(min(max($request->integer('perPage', 20), 1), 100));

        return PersonnelResource::collection($personnel)
            ->additional([
                'teams' => Personnel::query()->distinct()->orderBy('team')->pluck('team'),
            ]);
    }

    public function store(PersonnelRequest $request): PersonnelResource
    {
        return new PersonnelResource(Personnel::create($this->attributes($request)));
    }

    public function show(Personnel $personnel): PersonnelResource
    {
        return new PersonnelResource($personnel);
    }

    public function update(PersonnelRequest $request, Personnel $personnel): PersonnelResource
    {
        $personnel->update($this->attributes($request));

        return new PersonnelResource($personnel->refresh());
    }

    /** @return array<string, mixed> */
    private function attributes(PersonnelRequest $request): array
    {
        $data = $request->validated();

        return [
            'employee_id' => $data['employeeId'],
            'name' => $data['name'],
            'team' => $data['team'],
            'position' => $data['position'],
            'status' => $data['status'],
        ];
    }
}
