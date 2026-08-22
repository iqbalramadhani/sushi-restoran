<?4, 'status' => ['available', 'occupied', 'reserved']]);
    }

    public function findByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }
}
