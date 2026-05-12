import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staffApi';
import toast from 'react-hot-toast';

const STAFF_ID = "NV001"; // Gán cứng ID nhân viên để test

export const useStaffData = () => {
  const queryClient = useQueryClient();

  // Queries (Lấy dữ liệu)
  const activeTaskQuery = useQuery({
    queryKey: ['activeTask'],
    queryFn: () => staffApi.getActive(STAFF_ID),
    retry: 1
  });

  const pendingQuery = useQuery({
    queryKey: ['pendingList'],
    queryFn: staffApi.getPending,
    enabled: !activeTaskQuery.data, // Chỉ quét đơn chờ khi nhân viên đang rảnh
    refetchInterval: 5000 // Tự động quét 5s/lần
  });

  const historyQuery = useQuery({
    queryKey: ['staffHistory'],
    queryFn: () => staffApi.getHistory(STAFF_ID)
  });

  const profileQuery = useQuery({
    queryKey: ['staffProfile'],
    queryFn: () => staffApi.getProfile(STAFF_ID)
  });

  // Mutations (Thay đổi dữ liệu DB)
  const actions = {
    accept: useMutation({
      mutationFn: (id: string | number) => staffApi.accept(id, STAFF_ID),
      onSuccess: () => {
        toast.success('Nhận nhiệm vụ thành công!');
        queryClient.invalidateQueries({ queryKey: ['activeTask'] });
        queryClient.invalidateQueries({ queryKey: ['pendingList'] });
      },
      onError: () => toast.error('Lỗi khi nhận nhiệm vụ!')
    }),

    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string | number, status: string }) => staffApi.updateStatus(id, status),
      onSuccess: () => {
        toast.success('Cập nhật trạng thái thành công!');
        queryClient.invalidateQueries({ queryKey: ['activeTask'] });
      },
      onError: () => toast.error('Cập nhật trạng thái thất bại!')
    }),

    complete: useMutation({
      mutationFn: ({ id, finalCost }: { id: string | number, finalCost: number }) => staffApi.complete(id, finalCost),
      onSuccess: () => {
        toast.success('Đã lưu hóa đơn và hoàn thành nhiệm vụ!');
        queryClient.invalidateQueries({ queryKey: ['activeTask'] });
        queryClient.invalidateQueries({ queryKey: ['staffHistory'] });
      },
      onError: () => toast.error('Lỗi khi hoàn thành nhiệm vụ!')
    }),

    updateProfile: useMutation({
      mutationFn: (data: any) => staffApi.updateProfile(STAFF_ID, data),
      onSuccess: () => {
        toast.success('Cập nhật thông tin thành công!');
        queryClient.invalidateQueries({ queryKey: ['staffProfile'] });
      }
    }),
    
    updateServices: useMutation({
      mutationFn: (services: any) => staffApi.updateServices(STAFF_ID, services),
      onSuccess: () => {
        toast.success('Đã cập nhật dịch vụ cung cấp!');
        queryClient.invalidateQueries({ queryKey: ['staffProfile'] });
      }
    })
  };

  return { activeTaskQuery, pendingQuery, historyQuery, profileQuery, actions };
};