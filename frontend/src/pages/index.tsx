import { GetStaticProps } from 'next';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import Avatars from '../assets/avatares.png';
import Check from '../assets/check.svg';
import Logo from '../assets/logo.svg';
import Phones from '../assets/phones.png';
import { api } from '../lib/axios';

type HomeProps = {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
};

export default function Home({
  poolsCount,
  guessesCount,
  usersCount,
}: HomeProps) {
  const [namePool, setNamePool] = useState('');

  const createPool = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data: response } = await api.post('/pools', {
        title: namePool,
      });

      const { code } = response;

      await navigator.clipboard.writeText(code);

      alert('Copiado para a área de transferência!');
      setNamePool('');
    } catch (error) {
      console.log(error);
      alert('Erro ao criar o bolão.');
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={Logo} alt="NLW copa" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={Avatars} alt="Usuarios" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setNamePool(event.target.value)}
            value={namePool}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={Check} alt="Check" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={Check} alt="Check" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={Phones} alt="Dois celulares exibindo o app" quality={100} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessesCountResponse, uersCountResponse] =
    await Promise.all([
      api.get('http://localhost:3333/pools/count'),
      api.get('http://localhost:3333/guesses/count'),
      api.get('http://localhost:3333/users/count'),
    ]);

  return {
    revalidate: 60,
    props: {
      poolsCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: uersCountResponse.data.count,
    },
  };
};
