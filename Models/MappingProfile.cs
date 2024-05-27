using AutoMapper;

namespace ProjectOlympia
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AthleteData, Athlete>()
                .ForCtorParam("medals", o => o.MapFrom(k => new List<Medal>()));

            CreateMap<AddPlayerRequest, Player>();
            CreateMap<UpdatePlayerRequest, Player>();
            CreateMap<AddDraftRequest, Draft>();
            CreateMap<UpdateDraftRequest, Draft>();
            CreateMap<Draft, AddDraftResponse>();
            CreateMap<Draft, DraftData>();
            CreateMap<Player, PlayerData>();
        }
    }
}